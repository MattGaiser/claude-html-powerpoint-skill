import PptxGenJS from 'pptxgenjs';
import path from 'path';

/**
 * Builds a PPTX file from slide images
 */
export class PptxBuilder {
  constructor(options = {}) {
    this.title = options.title || 'Presentation';
    this.author = options.author || 'PowerPointGen';
    this.subject = options.subject || '';
    this.pptx = null;
  }

  init() {
    this.pptx = new PptxGenJS();
    this.pptx.title = this.title;
    this.pptx.author = this.author;
    this.pptx.subject = this.subject;

    // Set 16:9 layout (standard widescreen)
    this.pptx.defineLayout({ name: 'CUSTOM', width: 13.333, height: 7.5 });
    this.pptx.layout = 'CUSTOM';
  }

  /**
   * Add a slide with a full-bleed image
   * @param {string} imagePath - Path to the slide image
   */
  addSlide(imagePath) {
    if (!this.pptx) {
      this.init();
    }

    const slide = this.pptx.addSlide();

    // Add image as full slide background
    slide.addImage({
      path: imagePath,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%'
    });
  }

  /**
   * Add multiple slides from an array of image paths
   * @param {string[]} imagePaths - Array of image paths
   */
  addSlides(imagePaths) {
    for (const imagePath of imagePaths) {
      this.addSlide(imagePath);
    }
  }

  /**
   * Save the PPTX file
   * @param {string} outputPath - Path for the output file
   * @returns {Promise<string>} - Path to the saved file
   */
  async save(outputPath) {
    if (!this.pptx) {
      throw new Error('No slides added. Call init() or addSlide() first.');
    }

    // Ensure .pptx extension
    if (!outputPath.endsWith('.pptx')) {
      outputPath += '.pptx';
    }

    await this.pptx.writeFile({ fileName: outputPath });
    console.log(`PPTX saved: ${outputPath}`);
    return outputPath;
  }
}

export default PptxBuilder;
