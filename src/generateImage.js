#!/usr/bin/env node
/**
 * CLI tool to generate images using Google GenAI
 * Usage: node src/generateImage.js "prompt" output.png
 */

import { ImageGenerator } from './imageGenerator.js';
import path from 'path';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Generate images using Google GenAI');
  console.log('');
  console.log('Usage: node src/generateImage.js "<prompt>" <output.png>');
  console.log('');
  console.log('Environment variables:');
  console.log('  GOOGLE_API_KEY or GEMINI_API_KEY - Your API key');
  console.log('');
  console.log('Examples:');
  console.log('  node src/generateImage.js "a flowchart of a CI/CD pipeline" diagram.png');
  console.log('  node src/generateImage.js "isometric illustration of cloud architecture" cloud.png');
  process.exit(1);
}

const [prompt, outputFile] = args;
const outputPath = path.resolve(outputFile);

async function main() {
  try {
    const generator = new ImageGenerator();
    await generator.generateAndSave(prompt, outputPath);
    console.log(`\nImage saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
