# ApkStart v0.4.3

This release improves display rotation and fullscreen behavior, reduces host-side performance overhead, and adds a low-latency gaming mode.

## Rotation and fullscreen

- Rotation now changes the emulator's physical LCD dimensions (`hw.lcd.width` / `hw.lcd.height`) and restarts the emulator, instead of relying on runtime logical-resolution changes.
- Portrait uses a 720×1280 panel; landscape uses 1280×720.
- The selected orientation is persisted in settings.
- The fullscreen control switches to landscape and maximizes the host window.
- Removed the conflicting `-no-skin` launch option so the configured panel dimensions are respected.
- Improved window fitting so the emulator rendering surface is resized to the host client area before the emulator window is fitted. The window scan also repairs missed resize updates.

## Performance improvements

- Reduced window scanning from 120 ms polling during the first 90 seconds to 250 ms during the first 10 seconds and 1500 ms afterward.
- Gaming mode reduces scanning to 3000 ms.
- Avoided unnecessarily lowering the emulator process to Idle after the app closes.
- Gaming mode no longer installs the global low-level mouse hook, reducing desktop-wide input overhead.

## New: Gaming / low-latency mode

Available under **Settings → Performance & Resources → Virtual machine priority**.

- Raises the emulator process priority to High.
- Disables the global mouse hook.
- Reduces window scanning frequency to 3000 ms.
- The **Smooth** resource policy also selects this mode.

The default remains **Balanced**, since High priority can make other applications less responsive.

## Reliability and tests

- Settings parsing now tolerates a UTF-8 BOM instead of silently falling back to defaults when one is present.
- Added regression coverage for landscape panel sizing, launch arguments, and gaming-mode priority/input-hook behavior.
- The release workflow runs `npm test` before packaging.

## Upgrade

- **Portable edition:** extract over the existing folder. The data directory (default: `%APPDATA%\\apkstart`) is preserved.
- **Installer edition:** install over the existing installation.
