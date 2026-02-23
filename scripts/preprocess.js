#!/usr/bin/env node

/**
 * Markdown Preprocessor for Marp
 *
 * Include directive to reuse components:
 * <!-- @include ../components/self-intro.md -->
 * or
 * <!-- @include ../components/self-intro.md footer -->
 *
 * Usage:
 *   node scripts/preprocess.js input.md output.md
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const directory = dirname(filePath);

  return processIncludes(content, directory);
}

function processIncludes(content, baseDir) {
  // Match: <!-- @include path/to/file.md [section] -->
  const includeRegex = /<!--\s*@include\s+(.+?)\s*(?:(\w+))?\s*-->/g;

  return content.replace(includeRegex, (match, filePath, section) => {
    const fullPath = resolve(baseDir, filePath.trim());

    if (!existsSync(fullPath)) {
      console.error(`Warning: Include file not found: ${fullPath}`);
      return `<!-- ERROR: Include file not found: ${filePath} -->`;
    }

    let includedContent = readFileSync(fullPath, 'utf-8');

    // Handle sections (optional)
    if (section) {
      includedContent = extractSection(includedContent, section);
    }

    // Recursively process includes in the included content
    return processIncludes(includedContent, dirname(fullPath));
  });
}

function extractSection(content, sectionName) {
  // Match: <!-- @section footer --> ... <!-- @end section -->
  const sectionRegex = new RegExp(
    `<!--\\s*@section\\s+${sectionName}\\s*-->([\\s\\S]*?)<!--\\s*@end\\s+section\\s*-->`,
    'i'
  );

  const match = content.match(sectionRegex);
  if (match) {
    return match[1];
  }

  console.warn(`Warning: Section "${sectionName}" not found`);
  return content;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📋 Markdown Preprocessor for Marp

使い方:
  node scripts/preprocess.js input.md output.md

機能:
  <!-- @include path/to/component.md -->
  指定ファイルの内容を埋め込みます

  <!-- @include path/to/component.md sectionName -->
  指定セクションだけを埋め込みます

コンポーネントでセクション定義:
  <!-- @section sectionName -->
  ... content ...
  <!-- @end section -->

例:
  # スライド.md
  <!-- @include ../components/self-intro.md -->
  <!-- @include ../components/closing.md footer -->
    `);
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('❌ Error: input.md と output.md を指定してください');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;

  try {
    console.log(`🔄 Processing: ${inputFile}`);
    const processed = processFile(inputFile);
    writeFileSync(outputFile, processed);
    console.log(`✅ Done: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
