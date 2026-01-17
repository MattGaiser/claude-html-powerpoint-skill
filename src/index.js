import { readdir, mkdir, access, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SlideRenderer } from './renderer.js';
import { PptxBuilder } from './pptxBuilder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DECKS_DIR = path.join(ROOT_DIR, 'decks');

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
    height: options.height || 1080
  });

  await renderer.init();
  const imagePaths = await renderer.renderSlides(htmlFiles, outputPath);
  await renderer.close();

  console.log(`\nRendered ${imagePaths.length} images\n`);

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

if (args.length === 0) {
  console.log('PowerPointGen - Generate PPTX from HTML slides\n');
  console.log('Usage:');
  console.log('  npm run generate <deck-name>  Generate a specific deck');
  console.log('  npm run demo                  Generate the demo deck');
  await listDecks();
} else {
  const deckName = args[0];
  await generateDeck(deckName);
}
