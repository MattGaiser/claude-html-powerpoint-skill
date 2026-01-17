import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';

/**
 * Renders HTML slides to PNG images using Puppeteer
 */
export class SlideRenderer {
  constructor(options = {}) {
    this.width = options.width || 1920;
    this.height = options.height || 1080;
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
   * Render a single HTML file to a PNG image
   * @param {string} htmlPath - Path to the HTML file
   * @param {string} outputPath - Path for the output PNG
   * @returns {Promise<string>} - Path to the generated image
   */
  async renderSlide(htmlPath, outputPath) {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();

    await page.setViewport({
      width: this.width,
      height: this.height,
      deviceScaleFactor: 2 // 2x for high DPI
    });

    // Load the HTML file
    const fileUrl = `file://${path.resolve(htmlPath)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait a bit for any animations/fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false
    });

    await page.close();
    return outputPath;
  }

  /**
   * Render multiple HTML slides to PNG images
   * @param {string[]} htmlPaths - Array of HTML file paths
   * @param {string} outputDir - Directory for output images
   * @returns {Promise<string[]>} - Array of paths to generated images
   */
  async renderSlides(htmlPaths, outputDir) {
    await mkdir(outputDir, { recursive: true });

    const outputPaths = [];

    for (let i = 0; i < htmlPaths.length; i++) {
      const htmlPath = htmlPaths[i];
      const outputPath = path.join(outputDir, `slide_${String(i + 1).padStart(2, '0')}.png`);

      console.log(`Rendering slide ${i + 1}/${htmlPaths.length}: ${path.basename(htmlPath)}`);
      await this.renderSlide(htmlPath, outputPath);
      outputPaths.push(outputPath);
    }

    return outputPaths;
  }
}

export default SlideRenderer;
