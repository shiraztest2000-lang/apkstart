# Architecture

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Presentation  src/ui (HTML/CSS/JS)  ↔  preload (contextBridge)│
├─────────────────────────────────────────────────────────────┤
│ Orchestration src/main.js (windows/tray/CLI dispatch)        │
│               installer.js (installation pipeline)           │
├─────────────────────────────────────────────────────────────┤
│ Domain        engine.js (runtime lifecycle/probing/idle cleanup)│
│               adb.js (device operations)  sharer.js (file sync)│
├─────────────────────────────────────────────────────────────┤
│ Offline parsing zip.js → axml.js / arsc.js → apk.js          │
│                png.js / shortcut.js (icons and shortcuts)    │
├─────────────────────────────────────────────────────────────┤
│ Engine adapters: bundled QEMU (WHPX/TCG), image import,       │
│                  or an existing optional runtime             │
└─────────────────────────────────────────────────────────────┘
```

## Key flows

### 1. Install an APK by double-clicking it

```
Double-click .apk in File Explorer
  → HKCU\Software\Classes\ApkStart.apk\shell\open\command
  → ApkStart.exe "C:\...\xxx.apk"
  → main.js parseArgs → runInstall
      1. apk.js: parse offline (zip → manifest AXML → restore label/icon from arsc)
      2. engine.ensure(): start/probe the runtime if it is not ready
      3. adb install -r -g -t
      4. Convert icon to PNG (icons/) and multi-size ICO (icons/*.ico)
      5. shell.writeShortcutLink creates a desktop .lnk (--launch <pkg>)
      6. store.upsertApp saves metadata
```

### 2. Launch from a desktop shortcut (native-like experience)

```
Double-click <app name>.lnk
  → ApkStart.exe --launch <pkg>
  → Single-instance lock forwards to the running instance (or silently starts one)
  → adb am start --windowingMode 5 -n <pkg>/<activity>
  → Independent freeform window
  → Shell window hides/exits automatically; no extra window remains
```

### 3. File sharing

```
Local %USERPROFILE%\ApkStartShared  ⇄  Android /sdcard/ApkStartShared
Incremental bidirectional sync (mtime + size), polled every 8 seconds
and triggered by important actions.
```

## Why not use existing libraries?

| Requirement | Conventional approach | ApkStart approach | Reason |
|---|---|---|---|
| Read APK metadata | aapt2 / apk-parser | In-house ZIP + AXML + ARSC parser | No runtime dependencies, no SDK installation, no external process at startup |
| Convert icons to ICO | ImageMagick/sharp | nativeImage scaling + in-house ICO container | Avoids an 80 MB native dependency |
| File association | Installer writes to HKLM | HKCU + SHChangeNotify | No administrator rights; can be toggled in Settings |
| Emulator | Bundle all of VirtualBox | Engine adapter layer | Reuse an existing runtime at no extra cost; retain a controllable QEMU image-based option |

## Stability design

- All adb calls have timeouts and normalized errors (AdbError).
- Runtime probes run in parallel with a 4-second timeout and automatic fallback.
- QEMU idle watchdog: reclaim only after the configured idle period with no foreground app; never reclaim while an app is running.
- Settings and app manifests use atomic tmp + rename writes.

## App-level container model (performance)

### Where it differs from a true container

Huawei 卓易通, WSA, and Anbox are containers or compatibility layers: the host and guest share a kernel, and system services can start on demand. In theory, only services required by a particular app need to be loaded.

ApkStart is based on the Google Android Emulator (full-system QEMU virtualization). The Linux kernel, zygote, and system_server must boot together. It therefore **cannot load only the system services required by one app**; application-layer code cannot bypass this limitation.

However, the perceived overhead does not mainly come from those resident services. It comes from four other costs. Addressing them makes the experience similar to launching only the environment an app needs:

| Main overhead | Mitigation | Implementation |
|---|---|---|
| Booting all of Android for every app (40–142 seconds, high CPU/disk usage) | Boot once and keep the environment resident. Detached QEMU stays alive after ApkStart exits; the next launch adopts it with adoptExisting() and a quick-boot snapshot. Launching an app then only runs am start and attaches its window. | engine.js / emulator.js |
| Previously opened apps remain in the background using memory and network | Starting a new app force-stops other user apps; closing the last window runs am kill-all and deviceidle force-idle. | container.js / Runtime.beginApp() / endApp() |
| QEMU competes with the Windows desktop at Normal priority | Lower to BelowNormal after startup and Idle while parked; limit vCPUs to roughly one quarter of physical cores (2–3 cores). | win/priority.ps1 / doctor.liteProfile() |
| Sync, notifications, and window polling continue at full speed with no app open | Enable file sync and notification bridge only while an app window is open; limit window scans to 8 seconds after embed; use a 50 ms socket polling loop. | main.js / win/agent.ps1 |

### About ARM-to-x86 translation

This does **not** happen every time an app is opened; the translation layer is already included:

- The system image is x86_64, so x86 native APKs run directly.
- ARM-only APKs rely on the image's native bridge (the ARM-to-x86 binary translation layer included in the Google Play image). It is used as needed at runtime.
- ApkStart does not need to translate an app again every time it starts. Doing so on every launch would make startup slower.

### Root cause of mouse drift and system-wide slowdown (fixed)

win/agent.ps1 previously used a global low-level mouse hook (WH_MOUSE_LL) for side-button navigation, but installed it on the window-service thread, which was also blocked in sock.Poll(4000). Every Windows mouse event had to wait synchronously for that thread, potentially for 4 seconds. Closing the app did not uninstall the hook, so it continued slowing down the system for as long as ApkStart was running.

This was compounded by the I/O peak during first-time .xz extraction, e2fsck, and resize2fs initialization.

Fixes:

- The hook is no longer permanently installed. It runs on a dedicated message thread (GetMessage loop), only while an app window is foreground and at least one mouse mapping is enabled. It is removed on focus loss or close. The callback handles only seven target messages; all others, including left-button events, immediately pass through CallNextHookEx.
- The service loop changed from Poll(4000) to Poll(50).
- EnumWindows and SetWindowPos(SWP_FRAMECHANGED) changed from permanent 2-second polling to an 8-second window after embed, without forcibly recalculating the non-client area.
- First-time provisioning is delayed by 20 seconds to avoid competing with cold-start I/O.

### Mouse controls (left click to confirm / right click to go back / wheel to scroll)

The app window embeds the emulator's Qt child window. Native input handling is:

| Input | Native Qt behavior | ApkStart handling |
|---|---|---|
| Left button | Tap or press-and-drag to scroll | Never intercepted; passed through as the confirm/tap action |
| Right button | Also treated as a tap and can cause accidental input | Intercept WM_RBUTTONDOWN/UP/DBLCLK and send input keyevent 4 (Back) |
| Wheel | Sends a separate touch event for every notch, causing jitter | Intercept WM_MOUSEWHEEL/MOUSEHWHEEL and combine events into one input swipe over a 60–90 ms window |
| Side buttons | No default action | Optional mapping to Back / Forward (off by default) |

Wheel coalescing is implemented in win/agent.ps1 (PushWheel / FlushWheel); translation is handled by core/pointer.js (WheelRouter → wheelToSwipe). Input is sent through the persistent adb shell in AdbClient.input(), using echo __APKSTART_<id>__ for response matching and backpressure. This avoids spawning an adb process for every wheel notch and prevents swipe commands from queueing up in the shell.

Coordinates are mapped from the cursor's normalized position within the LCD. Horizontal wheel input produces horizontal swipes, and the resolution is refreshed after rotation.

The hook is installed only while an app window is foreground and removed when focus returns to the desktop or the window closes. If right-click Back, smooth wheel, and side-button mapping are all disabled, no global hook is installed.

### Configurable options (Settings → Mouse Controls / Performance & Lightweight Container)

| Option | Default | Description |
|---|---|---|
| engine.mouseRightBack | true | Right-click = Android Back; when disabled, Qt's default right-click-as-tap behavior is restored |
| engine.mouseWheelMode | smooth | smooth combines injected events; native lets Qt handle each notch; off disables interception |
| engine.mouseSideButtons | false | Map side buttons to Back / Forward; no global hook is installed when all three options are off |
| engine.liteMode | true | Limit vCPU allocation; when disabled, allocate more cores based on the machine |
| engine.priorityMode | balanced | In performance mode, QEMU uses Normal priority |
| engine.deepTrim | false | Additionally disable selected background system packages with pm disable-user; automatically restore them with pm enable when turned off |

Deep trimming deliberately leaves required components untouched, including gms, systemui, WebView, and input methods (see container.NEVER_TRIM), to avoid breaking app sign-in and push notifications.

### Lifecycle of a session

```
Cold boot (first run only, or after the AVD is deleted)
  materializeImages → e2fsck/resize2fs → boot_completed → saveSnapshot
        ↓
Open App A: ensure() adopts the resident environment → am start A → attach window
            → beginApp(A): stop other user apps, raise priority, enable sync/notifications
        ↓
Switch to App B: beginApp(B) → am start B (Android is not rebooted)
        ↓
Close the last window: endApp() → force-stop → am kill-all → deviceidle
            → lower QEMU to Idle → stop sync/notifications (park container; do not shut down)
        ↓
After idleShutdownMinutes: watchdog shuts down the runtime
(Previously, adopted instances could not be reclaimed because they had no local proc handle; fixed.)
```
