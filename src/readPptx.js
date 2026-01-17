#!/usr/bin/env node
/**
 * CLI tool to read and analyze PPTX files
 * Usage: node src/readPptx.js <file.pptx> [--no-images] [--output-dir <dir>]
 */

import { PptxReader } from './pptxReader.js';
import path from 'path';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`Read and analyze PowerPoint files

Usage: node src/readPptx.js <file.pptx> [options]

Options:
  --no-images       Skip rendering slides as images
  --output-dir <d>  Directory to save slide images (default: alongside pptx)
  --json            Output as JSON instead of markdown
  --help            Show this help

Examples:
  node src/readPptx.js presentation.pptx
  node src/readPptx.js deck.pptx --no-images
  node src/readPptx.js deck.pptx --output-dir ./preview --json
`);
}

async function main() {
  if (args.length === 0 || args.includes('--help')) {
    printHelp();
    process.exit(args.includes('--help') ? 0 : 1);
  }

  // Parse arguments
  const pptxPath = args.find(a => !a.startsWith('--'));
  const noImages = args.includes('--no-images');
  const jsonOutput = args.includes('--json');

  let outputDir = null;
  const outputDirIndex = args.indexOf('--output-dir');
  if (outputDirIndex !== -1 && args[outputDirIndex + 1]) {
    outputDir = args[outputDirIndex + 1];
  }

  if (!pptxPath) {
    console.error('Error: No PPTX file specified');
    process.exit(1);
  }

  try {
    const reader = new PptxReader();
    const result = await reader.read(pptxPath, {
      renderImages: !noImages,
      outputDir: outputDir
    });

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      const markdown = reader.formatAsMarkdown(result);
      console.log(markdown);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
