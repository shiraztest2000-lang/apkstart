'use strict';
/**
 * Render the uploaded ApkStart logo through Electron offscreen rendering.
 * Source artwork: src/ui/assets/new-logo.png
 * Outputs:
 *   src/ui/assets/logo.png (512px)
 *   src/ui/assets/logo-128.png (128px)
 *   src/ui/assets/appicon.ico (multi-size Windows icon)
 *   docs/images/logo.png and docs/promo/assets/logo.png (1024px)
 */
const { app, BrowserWindow, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');
const { pngToIco } = require('../src/core/shortcut');

const ROOT = path.join(__dirname, '..');
const SIZE = 1024;

app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const source = path.join(ROOT, 'src', 'ui', 'assets', 'new-logo.png');
  if (!fs.existsSync(source)) throw new Error('Uploaded logo not found: ' + source);

  const win = new BrowserWindow({
    width: SIZE,
    height: SIZE,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: { offscreen: true, backgroundThrottling: false },
  });
  win.setContentSize(SIZE, SIZE);
  await win.loadFile(path.join(__dirname, 'logo.html'));
  await new Promise((r) => setTimeout(r, 800));

  const img = await win.webContents.capturePage();
  const full = img.toPNG();
  const base = nativeImage.createFromBuffer(full);
  console.log('captured', base.getSize());

  const save = (size, files) => {
    const buf = size === SIZE ? full : base.resize({ width: size, height: size, quality: 'best' }).toPNG();
    for (const file of files) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buf);
      console.log(' ->', path.relative(ROOT, file), size + 'px', Math.round(buf.length / 1024) + 'KB');
    }
    return buf;
  };

  save(1024, [
    path.join(ROOT, 'docs', 'images', 'logo.png'),
    path.join(ROOT, 'docs', 'promo', 'assets', 'logo.png'),
  ]);
  save(512, [path.join(ROOT, 'src', 'ui', 'assets', 'logo.png')]);
  save(128, [path.join(ROOT, 'src', 'ui', 'assets', 'logo-128.png')]);

  const ico = pngToIco(full);
  fs.writeFileSync(path.join(ROOT, 'src', 'ui', 'assets', 'appicon.ico'), ico);
  console.log(' -> src/ui/assets/appicon.ico', Math.round(ico.length / 1024) + 'KB');

  win.destroy();
  app.exit(0);
}).catch((error) => {
  console.error(error);
  app.exit(1);
});
