#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, resolve, join, relative } from 'path';

const SLIDES_DIR = 'slides';
const PROCESSED_DIR = '.processed';

function processIncludes(content, baseDir) {
  const includeRegex = /<!--\s*@include\s+(.+?)\s*(?:(\w+))?\s*-->/g;

  return content.replace(includeRegex, (match, filePath, section) => {
    const fullPath = resolve(baseDir, filePath.trim());

    if (!existsSync(fullPath)) {
      console.warn(`Warning: Include file not found: ${fullPath}`);
      return `<!-- ERROR: Include file not found: ${filePath} -->`;
    }

    let includedContent = readFileSync(fullPath, 'utf-8');

    if (section) {
      includedContent = extractSection(includedContent, section);
    }

    return processIncludes(includedContent, dirname(fullPath));
  });
}

function extractSection(content, sectionName) {
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

function findMarkdownFiles(dir, files = []) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function preprocessFile(inputPath) {
  const content = readFileSync(inputPath, 'utf-8');
  const baseDir = dirname(inputPath);
  const processed = processIncludes(content, baseDir);

  const relativePath = relative(SLIDES_DIR, inputPath);
  const outputPath = join(PROCESSED_DIR, relativePath);
  const outputDir = dirname(outputPath);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(outputPath, processed);
  return outputPath;
}

function main() {
  console.log('🔄 Preprocessing slides with includes...\n');

  if (!existsSync(PROCESSED_DIR)) {
    mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const files = findMarkdownFiles(SLIDES_DIR);
  let processedCount = 0;

  for (const file of files) {
    const output = preprocessFile(file);
    console.log(`  ✓ ${file} → ${output}`);
    processedCount++;
  }

  console.log(`\n✅ Preprocessed ${processedCount} file(s)\n`);
}

main();
