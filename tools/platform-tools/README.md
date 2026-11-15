# Portable adb

Extract Android platform-tools into this directory (it should contain `adb.exe`). ApkStart will prefer this copy:

```
tools/platform-tools/
└─ adb.exe
```

Download: https://developer.android.com/tools/releases/platform-tools

If this directory is empty, ApkStart checks the following locations in order:

1. The adb path selected manually in Settings
2. This directory
3. `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe`
4. adb bundled with common Android emulators (LDPlayer / MuMu / BlueStacks)
5. The system PATH
