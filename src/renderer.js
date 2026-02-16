import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { createHash } from 'crypto';
import { mkdir, readFile, writeFile, access } from 'fs/promises';
import path from 'path';

const CACHE_FILE = '.render-cache.json';

/**
 * Renders HTML slides to optimized PNG images using Puppeteer
 * Supports parallel rendering, content-hash caching, and Sharp compression
 */
export class SlideRenderer {
  constructor(options = {}) {
    this.width = options.width || 1920;
    this.height = options.height || 1080;
    this.concurrency = options.concurrency || 4;
    this.compress = options.compress !== false;
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Render a single HTML file to an optimized PNG image
   * @param {string} htmlPath - Path to the HTML file
   * @param {string} outputPath - Path for the output PNG
   * @returns {Promise<string>} - Path to the generated image
   */
  async renderSlide(htmlPath, outputPath) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();

    try {
      await page.setViewport({
        width: this.width,
        height: this.height,
        deviceScaleFactor: 2
      });

      const fileUrl = `file://${path.resolve(htmlPath)}`;
      await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);

      if (this.compress) {
        // Capture as buffer, compress with Sharp, then write
        const rawBuffer = await page.screenshot({ type: 'png', fullPage: false });
        await sharp(rawBuffer)
          .resize(this.width, this.height)
          .png({ compressionLevel: 9 })
          .toFile(outputPath);
      } else {
        await page.screenshot({ path: outputPath, type: 'png', fullPage: false });
      }
    } finally {
      await page.close();
    }

    return outputPath;
  }

  /**
   * Render multiple HTML slides to PNG images with parallel execution and caching
   * @param {string[]} htmlPaths - Array of HTML file paths
   * @param {string} outputDir - Directory for output images
   * @param {object} options - Render options
   * @param {boolean} options.force - Skip cache and re-render all slides
   * @param {string[]} options.only - Only render slides matching these basenames (e.g. ['03-stats'])
   * @returns {Promise<string[]>} - Array of paths to generated images (in order)
   */
  async renderSlides(htmlPaths, outputDir, options = {}) {
    await mkdir(outputDir, { recursive: true });

    // Load cache
    const cache = options.force ? {} : await this.loadCache(outputDir);
    const newCache = {};

    // Build the work list
    const tasks = [];
    for (let i = 0; i < htmlPaths.length; i++) {
      const htmlPath = htmlPaths[i];
      const baseName = path.basename(htmlPath, '.html');
      const outputPath = path.join(outputDir, `slide_${String(i + 1).padStart(2, '0')}.png`);

      // Filter by --only if provided
      if (options.only && options.only.length > 0) {
        if (!options.only.some(o => baseName.includes(o))) {
          // Not in the only list — use existing output if it exists
          tasks.push({ htmlPath, outputPath, index: i, skip: true });
          continue;
        }
      }

      tasks.push({ htmlPath, outputPath, index: i, skip: false });
    }

    // Hash files and determine what needs rendering
    const renderQueue = [];
    const outputPaths = new Array(htmlPaths.length);

    for (const task of tasks) {
      outputPaths[task.index] = task.outputPath;

      if (task.skip) {
        continue;
      }

      const content = await readFile(task.htmlPath, 'utf-8');
      const hash = createHash('md5').update(content).digest('hex');
      newCache[task.htmlPath] = hash;

      // Check if cached and output file exists
      if (cache[task.htmlPath] === hash) {
        try {
          await access(task.outputPath);
          console.log(`  Cached (unchanged): ${path.basename(task.htmlPath)}`);
          continue;
        } catch {
          // Output file missing, need to re-render
        }
      }

      renderQueue.push(task);
    }

    // Preserve cache entries for skipped slides
    for (const task of tasks) {
      if (task.skip && cache[task.htmlPath]) {
        newCache[task.htmlPath] = cache[task.htmlPath];
      }
    }

    if (renderQueue.length === 0) {
      console.log('  All slides up-to-date, nothing to render.');
    } else {
      console.log(`  Rendering ${renderQueue.length}/${htmlPaths.length} slides (${this.concurrency} parallel)...\n`);

      // Render in parallel chunks
      for (let i = 0; i < renderQueue.length; i += this.concurrency) {
        const chunk = renderQueue.slice(i, i + this.concurrency);
        await Promise.all(chunk.map(async (task) => {
          const label = `  [${task.index + 1}/${htmlPaths.length}] ${path.basename(task.htmlPath)}`;
          const start = performance.now();
          await this.renderSlide(task.htmlPath, task.outputPath);
          const elapsed = ((performance.now() - start) / 1000).toFixed(1);
          console.log(`${label} (${elapsed}s)`);
        }));
      }
    }

    // Save cache
    await this.saveCache(outputDir, { ...newCache, ...Object.fromEntries(
      tasks.filter(t => t.skip && cache[t.htmlPath]).map(t => [t.htmlPath, cache[t.htmlPath]])
    )});

    // Filter out paths for slides whose output doesn't exist (skipped + no prior output)
    const validPaths = [];
    for (const p of outputPaths) {
      try {
        await access(p);
        validPaths.push(p);
      } catch {
        // skip missing
      }
    }

    return validPaths;
  }

  async loadCache(outputDir) {
    try {
      const data = await readFile(path.join(outputDir, CACHE_FILE), 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  async saveCache(outputDir, cache) {
    await writeFile(path.join(outputDir, CACHE_FILE), JSON.stringify(cache, null, 2));
  }
}

export default SlideRenderer;
