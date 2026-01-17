import 'dotenv/config';
import { parseOffice } from 'officeparser';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, mkdir, rm, readFile, access } from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

/**
 * Reads and parses PowerPoint files
 */
export class PptxReader {
  constructor(options = {}) {
    this.libreOfficePath = options.libreOfficePath || 'libreoffice';
  }

  /**
   * Extract text content and structure from a PPTX file
   * @param {string} pptxPath - Path to the .pptx file
   * @returns {Promise<object>} - Parsed presentation data
   */
  async extractContent(pptxPath) {
    console.log(`Parsing: ${pptxPath}`);

    const result = await parseOffice(pptxPath);

    // Structure the output
    const presentation = {
      path: pptxPath,
      metadata: result.metadata || {},
      slides: [],
      rawText: ''
    };

    // Handle different output formats from officeparser
    if (result.ast && Array.isArray(result.ast)) {
      // AST format (v6+)
      presentation.slides = result.ast.map((slide, index) => ({
        number: index + 1,
        content: this.extractTextFromAst(slide),
        raw: slide
      }));
    } else if (typeof result === 'string') {
      // Plain text format
      presentation.rawText = result;
      presentation.slides = this.splitTextIntoSlides(result);
    } else if (result.text) {
      presentation.rawText = result.text;
      presentation.slides = this.splitTextIntoSlides(result.text);
    }

    console.log(`Extracted ${presentation.slides.length} slides`);
    return presentation;
  }

  /**
   * Extract text from AST node recursively
   */
  extractTextFromAst(node, depth = 0) {
    if (!node) return '';

    if (typeof node === 'string') return node;

    if (Array.isArray(node)) {
      return node.map(n => this.extractTextFromAst(n, depth)).join('\n');
    }

    if (node.text) return node.text;

    if (node.children) {
      return this.extractTextFromAst(node.children, depth + 1);
    }

    if (node.content) {
      return this.extractTextFromAst(node.content, depth + 1);
    }

    return '';
  }

  /**
   * Split raw text into slide-like chunks
   */
  splitTextIntoSlides(text) {
    // Try to split on common slide delimiters
    const parts = text.split(/\n{3,}|\f/);
    return parts.filter(p => p.trim()).map((content, index) => ({
      number: index + 1,
      content: content.trim()
    }));
  }

  /**
   * Convert PPTX slides to images using LibreOffice
   * @param {string} pptxPath - Path to the .pptx file
   * @param {string} outputDir - Directory to save images
   * @returns {Promise<string[]>} - Array of image paths
   */
  async convertToImages(pptxPath, outputDir) {
    console.log(`Converting slides to images...`);

    // Create temp directory for conversion
    const tempDir = path.join(os.tmpdir(), `pptx-convert-${Date.now()}`);
    await mkdir(tempDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });

    try {
      // Use LibreOffice to convert to PNG
      const cmd = `${this.libreOfficePath} --headless --convert-to png --outdir "${tempDir}" "${pptxPath}"`;
      await execAsync(cmd, { timeout: 120000 });

      // LibreOffice creates a single PNG for single-page docs
      // For multi-slide, it creates slide1.png, slide2.png, etc.
      // Actually, LibreOffice converts to PDF first for multi-page, so let's use a different approach

      // Convert to PDF first, then PDF to images
      const pdfCmd = `${this.libreOfficePath} --headless --convert-to pdf --outdir "${tempDir}" "${pptxPath}"`;
      await execAsync(pdfCmd, { timeout: 120000 });

      const baseName = path.basename(pptxPath, '.pptx');
      const pdfPath = path.join(tempDir, `${baseName}.pdf`);

      // Check if pdftoppm is available for better quality
      let imagePaths = [];
      try {
        await execAsync('which pdftoppm');
        // Use pdftoppm for high quality conversion
        const ppmCmd = `pdftoppm -png -r 150 "${pdfPath}" "${path.join(outputDir, 'slide')}"`;
        await execAsync(ppmCmd, { timeout: 120000 });

        // Get generated files
        const files = await readdir(outputDir);
        imagePaths = files
          .filter(f => f.startsWith('slide') && f.endsWith('.png'))
          .sort()
          .map(f => path.join(outputDir, f));
      } catch {
        // Fallback: use ImageMagick convert if available
        try {
          await execAsync('which convert');
          const convertCmd = `convert -density 150 "${pdfPath}" "${path.join(outputDir, 'slide-%02d.png')}"`;
          await execAsync(convertCmd, { timeout: 120000 });

          const files = await readdir(outputDir);
          imagePaths = files
            .filter(f => f.startsWith('slide') && f.endsWith('.png'))
            .sort()
            .map(f => path.join(outputDir, f));
        } catch {
          // Last resort: just use the PDF
          console.warn('No PDF-to-image converter found. Using PDF directly.');
          const destPdf = path.join(outputDir, `${baseName}.pdf`);
          await execAsync(`cp "${pdfPath}" "${destPdf}"`);
          imagePaths = [destPdf];
        }
      }

      console.log(`Generated ${imagePaths.length} slide images`);
      return imagePaths;

    } finally {
      // Cleanup temp directory
      await rm(tempDir, { recursive: true, force: true });
    }
  }

  /**
   * Read a PPTX file and return both text content and images
   * @param {string} pptxPath - Path to the .pptx file
   * @param {object} options - Options
   * @returns {Promise<object>} - Complete presentation data
   */
  async read(pptxPath, options = {}) {
    const absolutePath = path.resolve(pptxPath);

    // Check file exists
    try {
      await access(absolutePath);
    } catch {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const result = {
      path: absolutePath,
      content: null,
      images: []
    };

    // Extract text content
    result.content = await this.extractContent(absolutePath);

    // Optionally convert to images
    if (options.renderImages !== false) {
      const outputDir = options.outputDir ||
        path.join(path.dirname(absolutePath), 'slides-preview');
      result.images = await this.convertToImages(absolutePath, outputDir);
      result.imagesDir = outputDir;
    }

    return result;
  }

  /**
   * Generate a markdown summary of the presentation
   * @param {object} presentationData - Data from read()
   * @returns {string} - Markdown formatted summary
   */
  formatAsMarkdown(presentationData) {
    const { content, images } = presentationData;
    let md = `# Presentation Summary\n\n`;

    if (content.metadata) {
      md += `## Metadata\n`;
      if (content.metadata.title) md += `- **Title:** ${content.metadata.title}\n`;
      if (content.metadata.author) md += `- **Author:** ${content.metadata.author}\n`;
      if (content.metadata.created) md += `- **Created:** ${content.metadata.created}\n`;
      md += `\n`;
    }

    md += `## Slides (${content.slides.length} total)\n\n`;

    content.slides.forEach((slide, index) => {
      md += `### Slide ${slide.number || index + 1}\n`;
      md += `${slide.content || '(No text content)'}\n\n`;
    });

    if (images && images.length > 0) {
      md += `## Slide Images\n`;
      md += `Images saved to: ${presentationData.imagesDir}\n\n`;
      images.forEach((img, index) => {
        md += `- Slide ${index + 1}: ${path.basename(img)}\n`;
      });
    }

    return md;
  }
}

/**
 * Quick function to read a PPTX file
 */
export async function readPptx(pptxPath, options = {}) {
  const reader = new PptxReader(options);
  return reader.read(pptxPath, options);
}

export default PptxReader;
