#!/usr/bin/env node
/**
 * Quick single-slide preview — renders one HTML slide to PNG and opens it
 *
 * Usage:
 *   npm run preview <deck-name> <slide-name>
 *   npm run preview demo 03-stats
 *   npm run preview path/to/slide.html
 */

import { SlideRenderer } from './renderer.js';
import { access, readdir } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DECKS_DIR = path.join(ROOT_DIR, 'decks');

function printHelp() {
  console.log(`Preview a single slide as PNG

Usage:
  npm run preview <deck-name> <slide-name>    Preview a slide by deck + name
  npm run preview <path/to/slide.html>        Preview a slide by file path

Examples:
  npm run preview demo 03-stats
  npm run preview decks/demo/slides/01-title.html

The rendered PNG opens automatically.
`);
}

/**
 * Open a file with the system default viewer
 */
function openFile(filePath) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open'
    : platform === 'win32' ? 'start'
    : 'xdg-open';
  exec(`${cmd} "${filePath}"`, (err) => {
    if (err) {
      console.log(`Preview saved to: ${filePath}`);
      console.log('(Could not auto-open — open the file manually)');
    }
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    printHelp();
    process.exit(args.includes('--help') ? 0 : 1);
  }

  let htmlPath;

  if (args.length === 1 && args[0].endsWith('.html')) {
    // Direct file path
    htmlPath = path.resolve(args[0]);
  } else if (args.length >= 2) {
    // deck-name + slide-name
    const [deckName, slideName] = args;
    const slidesDir = path.join(DECKS_DIR, deckName, 'slides');

    // Find the matching slide
    const files = await readdir(slidesDir);
    const match = files.find(f => f.includes(slideName) && f.endsWith('.html'));

    if (!match) {
      console.error(`Slide not found: "${slideName}" in ${slidesDir}`);
      console.error('Available slides:');
      files.filter(f => f.endsWith('.html')).sort().forEach(f => console.error(`  ${f}`));
      process.exit(1);
    }

    htmlPath = path.join(slidesDir, match);
  } else {
    printHelp();
    process.exit(1);
  }

  try {
    await access(htmlPath);
  } catch {
    console.error(`File not found: ${htmlPath}`);
    process.exit(1);
  }

  const outputPath = htmlPath.replace(/\.html$/, '.preview.png');
  const baseName = path.basename(htmlPath);

  console.log(`Previewing: ${baseName}`);

  const renderer = new SlideRenderer({ compress: true });
  await renderer.init();

  const start = performance.now();
  await renderer.renderSlide(htmlPath, outputPath);
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);

  await renderer.close();

  console.log(`Rendered in ${elapsed}s -> ${outputPath}`);
  openFile(outputPath);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
