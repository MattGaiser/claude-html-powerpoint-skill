/**
 * Test script for PowerPointGen
 * Run with: npm test
 */

import { SlideRenderer } from './renderer.js';
import { PptxBuilder } from './pptxBuilder.js';
import { ImageGenerator } from './imageGenerator.js';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

async function testRenderer() {
  console.log('\n=== Testing SlideRenderer ===\n');

  const renderer = new SlideRenderer({ width: 1920, height: 1080 });
  await renderer.init();

  const testSlide = path.join(ROOT_DIR, 'decks/demo/slides/01-title.html');
  const outputPath = path.join(ROOT_DIR, 'decks/demo/output/test_slide.png');

  await renderer.renderSlide(testSlide, outputPath);
  console.log('Renderer test passed: Image created at', outputPath);

  await renderer.close();
  return true;
}

async function testPptxBuilder() {
  console.log('\n=== Testing PptxBuilder ===\n');

  const builder = new PptxBuilder({
    title: 'Test Presentation',
    author: 'Test Runner'
  });

  builder.init();

  // Add a test slide
  const testImage = path.join(ROOT_DIR, 'decks/demo/output/slide_01.png');
  builder.addSlide(testImage);

  const outputPath = path.join(ROOT_DIR, 'decks/demo/output/test_output.pptx');
  await builder.save(outputPath);

  console.log('PptxBuilder test passed: PPTX created at', outputPath);
  return true;
}

async function testImageGenerator() {
  console.log('\n=== Testing ImageGenerator ===\n');

  // Check for API key
  if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
    console.log('Skipping ImageGenerator test: No API key found');
    console.log('Set GOOGLE_API_KEY or GEMINI_API_KEY to test image generation');
    return true;
  }

  try {
    const generator = new ImageGenerator();
    const outputPath = path.join(ROOT_DIR, 'decks/demo/output/test_generated.png');

    await generator.generateAndSave(
      'A simple flowchart diagram showing three connected boxes labeled Input, Process, and Output',
      outputPath
    );

    console.log('ImageGenerator test passed: Image created at', outputPath);
    return true;
  } catch (error) {
    console.error('ImageGenerator test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('PowerPointGen Test Suite');
  console.log('========================\n');

  const results = {
    renderer: false,
    pptxBuilder: false,
    imageGenerator: false
  };

  try {
    results.renderer = await testRenderer();
  } catch (error) {
    console.error('Renderer test failed:', error.message);
  }

  try {
    results.pptxBuilder = await testPptxBuilder();
  } catch (error) {
    console.error('PptxBuilder test failed:', error.message);
  }

  try {
    results.imageGenerator = await testImageGenerator();
  } catch (error) {
    console.error('ImageGenerator test failed:', error.message);
  }

  console.log('\n=== Test Results ===\n');
  console.log('SlideRenderer:', results.renderer ? 'PASS' : 'FAIL');
  console.log('PptxBuilder:', results.pptxBuilder ? 'PASS' : 'FAIL');
  console.log('ImageGenerator:', results.imageGenerator ? 'PASS' : 'FAIL');

  const allPassed = Object.values(results).every(r => r);
  console.log('\nOverall:', allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');

  process.exit(allPassed ? 0 : 1);
}

runTests();
