# Runtime Engine Directory (Optional Manual Setup)

**Since version 0.2, ApkStart is self-contained by default.** The application automatically downloads and deploys adb, QEMU, and system images to:

`%APPDATA%\\apkstart\\runtime\\`

No manual preparation is normally required.

This directory is only intended for the following optional cases:

## 1. Manually Providing QEMU (Blocked Download Sources or a Specific Version)

```
engine/qemu/
├─ qemu-system-x86_64.exe
├─ qemu-img.exe
└─ ... (other QEMU files)
```

Official QEMU Windows builds: https://qemu.weilnetz.de/w64/

The `qemu-w64-setup-*.exe` file is an NSIS installer. ApkStart installs it silently into the runtime directory using `/S /D=`. You can also extract the installer with 7-Zip and place the files in the directory shown above.

## 2. Manually Providing adb

```
tools/platform-tools/
└─ adb.exe
```

Download: https://developer.android.com/tools/releases/platform-tools

## System Images

- Recommended: Android-x86 9.0-r2 (x86_64), which can be downloaded directly in the app with mirror selection and resume support.
- Alternatively, import any disk image with Android already installed (`qcow2` / `raw` / `vmdk`) using **Runtime → Import**.
- After import, ApkStart boots directly from the disk image; no installation step is required.

## Hardware Acceleration

To enable WHPX for QEMU: open Control Panel → **Turn Windows features on or off** → select **Virtual Machine Platform** → restart Windows.

If hardware acceleration is not enabled, ApkStart automatically falls back to software emulation (TCG), which makes the first startup slower.
