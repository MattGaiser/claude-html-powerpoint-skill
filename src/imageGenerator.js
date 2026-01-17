import 'dotenv/config';
import { GoogleGenAI, Modality } from '@google/genai';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Generates images using Google's Gemini/Imagen API
 */
export class ImageGenerator {
  constructor(options = {}) {
    const apiKey = options.apiKey || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Google API key required. Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable, ' +
        'or pass apiKey in options.'
      );
    }

    this.genAI = new GoogleGenAI({ apiKey });
    this.model = options.model || 'gemini-3-pro-image-preview'; // Nano Banana Pro
    this.aspectRatio = options.aspectRatio || '16:9';
    this.imageSize = options.imageSize || '2K';
  }

  /**
   * Generate an image from a text prompt
   * @param {string} prompt - Description of the image to generate
   * @param {object} options - Generation options
   * @returns {Promise<Buffer>} - Image data as a buffer
   */
  async generateImage(prompt, options = {}) {
    const enhancedPrompt = options.enhancePrompt !== false
      ? this.enhancePromptForSlides(prompt)
      : prompt;

    console.log(`Generating image: "${prompt.substring(0, 50)}..."`);

    const response = await this.genAI.models.generateContent({
      model: this.model,
      contents: enhancedPrompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        imageConfig: {
          aspectRatio: options.aspectRatio || this.aspectRatio,
          imageSize: options.imageSize || this.imageSize,
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const imageData = Buffer.from(part.inlineData.data, 'base64');
        return imageData;
      }
    }

    throw new Error('No image generated in response');
  }

  /**
   * Generate an image and save it to a file
   * @param {string} prompt - Description of the image to generate
   * @param {string} outputPath - Path to save the image
   * @param {object} options - Generation options
   * @returns {Promise<string>} - Path to the saved image
   */
  async generateAndSave(prompt, outputPath, options = {}) {
    const imageData = await this.generateImage(prompt, options);

    // Ensure directory exists
    await mkdir(path.dirname(outputPath), { recursive: true });

    await writeFile(outputPath, imageData);
    console.log(`Image saved: ${outputPath}`);

    return outputPath;
  }

  /**
   * Generate multiple images
   * @param {Array<{prompt: string, outputPath: string}>} requests - Array of generation requests
   * @param {object} options - Generation options
   * @returns {Promise<string[]>} - Array of saved image paths
   */
  async generateBatch(requests, options = {}) {
    const results = [];

    for (const request of requests) {
      const outputPath = await this.generateAndSave(
        request.prompt,
        request.outputPath,
        options
      );
      results.push(outputPath);
    }

    return results;
  }

  /**
   * Enhance a prompt for better slide-appropriate images
   * @param {string} prompt - Original prompt
   * @returns {string} - Enhanced prompt
   */
  enhancePromptForSlides(prompt) {
    return `Create a professional, clean image suitable for a business presentation slide.
The image should have a modern, minimalist aesthetic with good contrast and clear visual hierarchy.
Style: Corporate, professional, clean lines, suitable for presentations.

Image request: ${prompt}

Text guidelines: Minimize text, labels, and captions. Only include text if absolutely essential to the image (e.g., a sign that's central to the scene). Prefer visual communication over written labels. Most text will be added via HTML/CSS overlay.
The image should work well on a slide background and not be too busy or cluttered.`;
  }
}

/**
 * Helper function to generate a diagram/illustration for a slide
 * @param {string} description - What to generate
 * @param {string} outputPath - Where to save
 * @param {object} options - Options including apiKey
 * @returns {Promise<string>} - Path to generated image
 */
export async function generateDiagram(description, outputPath, options = {}) {
  const generator = new ImageGenerator(options);
  return generator.generateAndSave(description, outputPath, options);
}

export default ImageGenerator;
