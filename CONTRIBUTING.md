# Contributing Guide

Issues and pull requests are welcome. This project aims to keep the desktop shell dependency-free and its behavior predictable. Please read the guidelines below before contributing.

## Development Environment

- Windows 10/11 x64
- Node.js 20 or later
- `npm install && npm start`

## Pre-submission Checks

```powershell
npm test          # Pure Node.js unit tests and runtime-flow tests (no network or virtual machine required)
```

For UI changes, it is also recommended to capture a smoke-test screenshot and check that the layout remains intact:

```powershell
electron . --smoke test\\shot.png
```

## Coding Conventions

- **Do not add third-party runtime dependencies to the desktop shell.** ZIP / AXML / ARSC / PNG / ICO parsing under `src/core/` is implemented in-house. Prefer Node.js built-in modules when adding features instead of introducing a large package for a small task.
- The renderer uses native HTML/CSS/JavaScript and does not use a frontend framework.
- All Android-side communication must go through `src/core/adb.js`; do not construct adb commands independently throughout the codebase.
- The main and renderer processes must communicate only through the allowlisted channels exposed by `preload.js`. Keep `contextIsolation` enabled.
- Write comments and user-interface text in English. Keep identifiers in English as well.

## Testing Guidelines

- If no real APK is available, tests automatically skip the APK parsing portion. To cover it, set the environment variable to point to any APK:

```powershell
$env:APKSTART_TEST_APK="C:\\path\\to\\any.apk"; npm test
```

- Do not access external networks from tests. For tests that need network behavior, start a local `http` server (see `test/engine-test.js`).

## Commit Messages

Use the Conventional Commits style, for example:

```
feat(engine): support importing qcow2 disks from a custom path
fix(axml): correct the attribute-table base offset
docs: add instructions for enabling WHPX
```

## Legal and Scope

- This project does not distribute Android system images, QEMU binaries, or Google components. They are downloaded on demand by the user's machine.
- Do not commit commercial APKs, cracking tools, or content that infringes third-party copyrights to this repository.
