'use strict';
/**
 * Build the portable edition in dist/ApkStart-win64-portable/
 *   ApkStart.exe (renamed from electron.exe) + resources/app (application source)
 * No installer is required; extract and run. The same directory layout can be reused by electron-builder.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Allow a custom output directory when a running instance locks the target; build elsewhere first, then replace it.
let OUT = process.env.APKSTART_PACK_OUT
  ? path.resolve(process.env.APKSTART_PACK_OUT)
  : path.join(ROOT, 'dist', 'ApkStart-win64-portable');
const ELECTRON_DIST = path.join(ROOT, 'node_modules', 'electron', 'dist');

function copy(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

console.log('Building portable edition →', OUT);
// Do not recursively delete an existing target: some environments block bulk deletion, and a failed build could destroy
// the last working build. Rename and preserve the old directory before building; use another output path if it is locked.
if (fs.existsSync(OUT)) {
  try {
    const backup = `${OUT}.prev-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    fs.renameSync(OUT, backup);
    console.log('Previous build preserved →', backup);
  } catch (_) {
    // Some environments (antivirus, search indexing, or File Explorer) hold directory handles for a long time,
    // making a directory rename fail with EBUSY. Fall back to a versioned output directory.
    OUT = path.join(ROOT, 'dist', `ApkStart-v${require(path.join(ROOT, 'package.json')).version}-win64-portable`);
    console.log('Previous directory is locked; using output path →', OUT);
  }
}
fs.mkdirSync(path.join(OUT, 'resources', 'app'), { recursive: true });

// 1. Electron 运行时
console.log('Copying Electron runtime…');
copy(ELECTRON_DIST, OUT);
fs.rmSync(path.join(OUT, 'resources', 'default_app.asar'), { force: true });

// 1.1 Reduce locale payload: Electron ships 55 locale packs (about 41 MB). Keep the locales supported by the app.
//     Keep zh-CN / zh-TW / en-US and remove the rest (about 39 MB saved, reducing the package by roughly 15%).
const KEEP_LOCALES = new Set(['zh-CN.pak', 'zh-TW.pak', 'en-US.pak']);
let localeSaved = 0;
try {
  const locDir = path.join(OUT, 'locales');
  for (const f of fs.readdirSync(locDir)) {
    if (KEEP_LOCALES.has(f)) continue;
    localeSaved += (() => { try { return fs.statSync(path.join(locDir, f)).size; } catch (_) { return 0; } })();
    fs.rmSync(path.join(locDir, f), { force: true });
  }
} catch (_) { /* 没有 locales 目录也不影响 */ }

// 1.2 Remove files not needed by users: changelogs, debug symbols, and selected unused pak files (0.1–9 MB each).
for (const rel of ['LICENSES.chromium.html.bak', 'vk_swiftshader_icd.json.bak']) {
  fs.rmSync(path.join(OUT, rel), { force: true });
}

// 1.3 Runtime libraries that can be omitted:
//     d3dcompiler_47.dll compiles ANGLE HLSL into GPU instructions. Since Windows 8.1,
//     System32 includes this DLL. If the bundled copy is absent, LoadLibrary uses the system copy.
//     Smoke-test screenshots showed no UI, icon, or font rendering differences after removal. Saves about 2.1 MB.
//     Do not remove vk_swiftshader.dll or vulkan-1.dll: Chromium relies on them
//     for software-rendering fallback when the GPU driver is unavailable; removing them can cause a blank window.
let pruneSaved = 0;
for (const rel of ['d3dcompiler_47.dll']) {
  const p = path.join(OUT, rel);
  try {
    pruneSaved += fs.statSync(p).size;
    fs.rmSync(p, { force: true });
  } catch (_) { /* 本来就没有 */ }
}

// 2. 应用本体
console.log('复制应用…');
const appDir = path.join(OUT, 'resources', 'app');
for (const item of ['package.json', 'src', 'LICENSE']) {
  const src = path.join(ROOT, item);
  if (fs.existsSync(src)) copy(src, path.join(appDir, item));
}

// 3. 可选目录
// engine/ 下只有文档类内容随包分发；大体积运行时组件（emulator、system-images、
// platform-tools、avd）由应用首次启动时自动从官方源下载，不进安装包。
// tools/ 是开发期自检脚本（黑窗实测、测速），用户用不到，不再随包分发。
const ENGINE_SKIP = new Set(['emulator', 'system-images', 'platform-tools', 'avd', 'aehd', '_dl', 'qemu']);
for (const opt of ['engine']) {
  const src = path.join(ROOT, opt);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(appDir, opt);
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (opt === 'engine' && ENGINE_SKIP.has(entry.name)) continue;
    fs.cpSync(path.join(src, entry.name), path.join(dest, entry.name), { recursive: true });
  }
}

// 4. 改名主程序
fs.renameSync(path.join(OUT, 'electron.exe'), path.join(OUT, 'ApkStart.exe'));

// 5. 版本信息
const pkg = require(path.join(ROOT, 'package.json'));
fs.writeFileSync(path.join(OUT, 'VERSION.txt'), `ApkStart ${pkg.version}\n构建时间：${new Date().toLocaleString('zh-CN')}\n`);

// 6. 体积报告：每次打包都打印，避免以后又悄悄变胖
function dirSize(dir) {
  let n = 0;
  try {
    for (const it of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, it.name);
      n += it.isDirectory() ? dirSize(p) : fs.statSync(p).size;
    }
  } catch (_) { /* ignore */ }
  return n;
}
const totalMB = dirSize(OUT) / 1048576;
console.log(
  `完成。整包 ${totalMB.toFixed(0)} MB（语言包省了 ${(localeSaved / 1048576).toFixed(0)} MB，`
  + `冗余运行库省了 ${(pruneSaved / 1048576).toFixed(1)} MB）。`,
);
console.log('压缩：node build/zip.js dist/ApkStart-win64-portable <输出.zip>');
console.log(`运行 ${path.join(OUT, 'ApkStart.exe')} 即可使用。`);
