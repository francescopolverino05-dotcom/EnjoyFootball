#!/usr/bin/env node
/**
 * Export scout card HTML → PNG + MP4 for iMovie.
 * Usage: node scripts/export-scout-card.mjs [htmlPath] [outBasename]
 */
import { spawnSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const htmlPath = resolve(process.argv[2] || join(root, 'public/scout-cards/david-osifo-export.html'));
const outDir = resolve(process.argv[3] || join(root, 'public/scout-cards'));
const baseName = process.argv[4] || 'david-osifo-imovie';

if (!existsSync(htmlPath)) {
  console.error('Missing HTML:', htmlPath);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const pngPath = join(outDir, `${baseName}.png`);
const fullPngPath = join(outDir, `${baseName}-full.png`);
const mp4Path = join(outDir, `${baseName}.mp4`);
const fullMp4Path = join(outDir, `${baseName}-full.mp4`);

const fileUrl = `file://${htmlPath}`;

async function main() {
  let browser;
  try {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 500));

    const card = await page.$('.card');
    if (!card) throw new Error('Missing .card element');
    await card.screenshot({ path: pngPath, type: 'png' });
    console.log('PNG', pngPath);

    await page.screenshot({ path: fullPngPath, type: 'png' });
    console.log('PNG', fullPngPath);
  } finally {
    if (browser) await browser.close();
  }

  const ff = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loop',
      '1',
      '-i',
      pngPath,
      '-c:v',
      'libx264',
      '-t',
      '10',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '30',
      '-vf',
      'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x161616',
      mp4Path,
    ],
    { stdio: 'inherit' }
  );
  if (ff.status !== 0) {
    console.error('ffmpeg failed');
    process.exit(ff.status ?? 1);
  }
  console.log('MP4', mp4Path);

  const ffFull = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loop',
      '1',
      '-i',
      fullPngPath,
      '-c:v',
      'libx264',
      '-t',
      '10',
      '-pix_fmt',
      'yuv420p',
      '-r',
      '30',
      fullMp4Path,
    ],
    { stdio: 'inherit' }
  );
  if (ffFull.status === 0) console.log('MP4', fullMp4Path);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
