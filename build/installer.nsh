; ApkStart custom NSIS script
; Purpose: stop any runtime processes that may still be running in the background before uninstalling,
; otherwise they may lock files in the installation directory and prevent a clean uninstall.
;
; ApkStart may leave a detached QEMU process running after exit to make the next startup faster,
; so the uninstaller must perform its own cleanup.

; Installation finalization: add a fallback desktop shortcut.
; electron-builder's createDesktopShortcut uses its own CreateShortcuts flow.
; In some environments (OneDrive-redirected desktops or security software reverting shortcuts), shortcut creation may fail.
; The user may then find no shortcut on the desktop. Use NSIS CreateShortcut as a second attempt:
; $DESKTOP uses SHGetFolderPath and follows redirected desktop paths. This operation is idempotent;
; running it after electron-builder simply overwrites the same .lnk file.
!macro customInstall
  DetailPrint "Creating desktop shortcut…"
  CreateShortcut "$DESKTOP\ApkStart.lnk" "$INSTDIR\ApkStart.exe" "" "$INSTDIR\ApkStart.exe" 0 \
    SW_SHOWNORMAL "" "ApkStart — Run Android apps directly on your PC"
  CreateDirectory "$SMPROGRAMS\ApkStart"
  CreateShortcut "$SMPROGRAMS\ApkStart\ApkStart.lnk" "$INSTDIR\ApkStart.exe" "" "$INSTDIR\ApkStart.exe" 0 \
    SW_SHOWNORMAL "" "ApkStart — 在电脑上直接运行安卓应用"
!macroend

!macro customUnInstall
  ; Remove shortcuts created by this script so none remain after uninstall.
  Delete "$DESKTOP\ApkStart.lnk"
  Delete "$SMPROGRAMS\ApkStart\ApkStart.lnk"
  RMDir "$SMPROGRAMS\ApkStart"

  DetailPrint "Stopping leftover ApkStart processes…"
  ; /F forces termination and /T includes child processes. Ignore taskkill's 128 exit code if a process does not exist.
  nsExec::Exec 'taskkill.exe /F /T /IM ApkStart.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM qemu-system-x86_64.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM qemu-system-i386.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM emulator.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM emulator-check.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM adb.exe'
  nsExec::Exec 'taskkill.exe /F /T /IM netsimd.exe'
  ; Allow processes time to exit and release file handles
  Sleep 1500
!macroend
