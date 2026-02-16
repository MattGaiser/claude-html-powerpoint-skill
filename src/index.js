import { readdir, mkdir, access, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SlideRenderer } from './renderer.js';
import { PptxBuilder } from './pptxBuilder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DECKS_DIR = path.join(ROOT_DIR, 'decks');

/**
 * Parse CLI flags from args array
 */
function parseFlags(args) {
  const flags = { positional: [] };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--force') {
      flags.force = true;
    } else if (args[i] === '--only') {
      flags.only = [];
      // Collect all following non-flag args as slide names
      while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags.only.push(args[++i]);
      }
    } else if (args[i] === '--no-compress') {
      flags.compress = false;
    } else if (args[i] === '--concurrency') {
      flags.concurrency = parseInt(args[++i], 10);
    } else if (!args[i].startsWith('--')) {
      flags.positional.push(args[i]);
    }
  }

  return flags;
}

/**
 * Generate a PPTX from a deck folder
 * @param {string} deckName - Name of the deck folder
 * @param {object} options - Generation options
 */
async function generateDeck(deckName, options = {}) {
  const deckPath = path.join(DECKS_DIR, deckName);
  const slidesPath = path.join(deckPath, 'slides');
  const outputPath = path.join(deckPath, 'output');

  // Check if deck exists
  try {
    await access(slidesPath);
  } catch {
    console.error(`Deck not found: ${deckName}`);
    console.error(`Expected slides at: ${slidesPath}`);
    process.exit(1);
  }

  console.log(`\n=== Generating deck: ${deckName} ===\n`);

  // Get all HTML files in order
  const files = await readdir(slidesPath);
  const htmlFiles = files
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(f => path.join(slidesPath, f));

  if (htmlFiles.length === 0) {
    console.error('No HTML slides found in:', slidesPath);
    process.exit(1);
  }

  console.log(`Found ${htmlFiles.length} slides\n`);

  // Create output directory
  await mkdir(outputPath, { recursive: true });

  // Render HTML to images
  console.log('--- Rendering slides to images ---\n');
  const renderer = new SlideRenderer({
    width: options.width || 1920,
    height: options.height || 1080,
    concurrency: options.concurrency || 4,
    compress: options.compress !== false
  });

  await renderer.init();

  const start = performance.now();
  const imagePaths = await renderer.renderSlides(htmlFiles, outputPath, {
    force: options.force || false,
    only: options.only || null
  });
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);

  await renderer.close();

  console.log(`\nRendered ${imagePaths.length} images in ${elapsed}s\n`);

  // Load deck config if exists
  let config = { title: deckName };
  try {
    const configPath = path.join(deckPath, 'config.json');
    const configData = await readFile(configPath, 'utf-8');
    config = { ...config, ...JSON.parse(configData) };
  } catch {
    // No config file, use defaults
  }

  // Build PPTX
  console.log('--- Building PPTX ---\n');
  const builder = new PptxBuilder({
    title: config.title,
    author: config.author || 'PowerPointGen',
    subject: config.subject || ''
  });

  builder.init();
  builder.addSlides(imagePaths);

  const pptxPath = path.join(outputPath, `${deckName}.pptx`);
  await builder.save(pptxPath);

  console.log(`\n=== Done! ===`);
  console.log(`Output: ${pptxPath}\n`);

  return pptxPath;
}

/**
 * List available decks
 */
async function listDecks() {
  try {
    const entries = await readdir(DECKS_DIR, { withFileTypes: true });
    const decks = entries.filter(e => e.isDirectory()).map(e => e.name);

    if (decks.length === 0) {
      console.log('No decks found. Create a deck in the decks/ folder.');
      return;
    }

    console.log('\nAvailable decks:');
    for (const deck of decks) {
      console.log(`  - ${deck}`);
    }
    console.log('\nRun: npm run generate <deck-name>');
  } catch {
    console.log('No decks folder found. Creating...');
    await mkdir(DECKS_DIR, { recursive: true });
  }
}

// CLI
const args = process.argv.slice(2);
const flags = parseFlags(args);

if (flags.positional.length === 0) {
  console.log('PowerPointGen - Generate PPTX from HTML slides\n');
  console.log('Usage:');
  console.log('  npm run generate <deck-name>           Generate a specific deck');
  console.log('  npm run generate <deck-name> --force    Re-render all slides (skip cache)');
  console.log('  npm run generate <deck-name> --only 03-stats 05-quote');
  console.log('                                          Only re-render specific slides');
  console.log('  npm run generate <deck-name> --no-compress');
  console.log('                                          Skip Sharp compression');
  console.log('  npm run generate <deck-name> --concurrency 8');
  console.log('                                          Parallel render limit (default: 4)');
  console.log('  npm run demo                            Generate the demo deck');
  await listDecks();
} else {
  const deckName = flags.positional[0];
  await generateDeck(deckName, flags);
}
