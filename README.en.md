# ApkStart

<p align="center"><img src="docs/images/logo.png" alt="ApkStart logo" width="160" /></p>

<p align="center">
  <a href="README.fa.md">🇮🇷 فارسی</a> ·
  <a href="README.en.md">🇬🇧 English</a> ·
  <a href="README.zh-CN.md">🇨🇳 简体中文</a>
</p>

[![CI](https://github.com/RoutineMiku/apkstart/actions/workflows/ci.yml/badge.svg)](https://github.com/RoutineMiku/apkstart/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/RoutineMiku/apkstart?include_prereleases&sort=semver)](https://github.com/RoutineMiku/apkstart/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11%20x64-0078D6.svg)](#)

**Run Android apps on Windows as if they were native desktop applications.** ApkStart installs APK files, creates individual Windows shortcuts, and launches each Android app in its own resizable window.

## Highlights

- **Install by double-clicking an APK:** Associate `.apk` files with ApkStart and install them directly from File Explorer.
- **A desktop shortcut for every app:** App icons are extracted from APK files and converted to Windows ICO files. Launch an installed app from its own shortcut.
- **One app, one window:** Android apps run in independent windows. Choose a portrait window that can be resized or fullscreen mode; window sizes can be remembered per app.
- **Windows Start menu integration:** Create desktop and Start menu shortcuts so installed apps can be found with Windows Search.
- **Two-way file sharing:** Files in `%USERPROFILE%\ApkStartShared` are synchronized with `/sdcard/ApkStartShared` inside Android.
- **Lightweight host application:** The desktop shell has no third-party runtime dependencies. The Android runtime starts on demand and can be configured to reuse an existing compatible runtime.

![ApkStart main window](docs/images/app.png)

## Download

Prebuilt releases are available from:

- [GitHub Releases](https://github.com/RoutineMiku/apkstart/releases)
- [Gitee Releases](https://gitee.com/daily-miku/apkstart/releases)

Available packages:

- **`ApkStart-v*-Setup.exe`** — the installer package includes the Android runtime components. After installation, the first launch unpacks the runtime locally; it does not need to download those components again.
- **`ApkStart-v*-win64-portable.zip`** — a smaller portable package. The runtime is downloaded when it is first needed.

## Updates

Use **Settings → Software update → Check for updates**, or choose **Check for updates** from the tray menu. ApkStart checks the available release sources and selects a suitable download route. Updating the application does not remove the runtime, installed apps, or snapshots stored in the user data directory.

## Build from source

Requirements: Windows 10/11 x64 and Node.js 20 or later.

```powershell
npm install
npm start
```

Optional commands:

```powershell
npm run assoc:on       # Register .apk file association
npm run pack           # Build the portable package
npm run runtime        # Prepare bundled runtime components
npm run build:exe      # Build the Windows installer
npm test               # Run the automated test suites
npm run selftest       # Run runtime checks after Android is deployed
```

See the original [Simplified Chinese documentation](README.zh-CN.md) for more implementation details and advanced runtime notes.

## Runtime and compatibility

ApkStart manages its Android runtime under `%APPDATA%\apkstart\runtime`. The default setup uses Android Emulator, adb, and an Android system image. Hardware acceleration is used when available; software rendering is used as a fallback. ARM compatibility options are available for apps that require ARM native libraries, but compatibility can vary by app and Windows hardware.

## Project structure

- `src/main.js` — Electron main process, window and tray management.
- `src/ui/` — HTML, CSS, and JavaScript user interface.
- `src/core/` — APK parsing, runtime management, installation, shortcuts, adb, and file synchronization.
- `build/` — packaging and runtime preparation scripts.
- `test/` — unit and integration tests.

## Contributing

Issues and pull requests are welcome. Please run `npm test` before submitting changes. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Author and license

Developed and maintained by **RoutineMiku**.

- [Original project](https://github.com/RoutineMiku/apkstart)
- [MIT License](LICENSE)

The application code is licensed under MIT. Android system images, emulator binaries, and Google components are downloaded separately and remain subject to their respective licenses.
