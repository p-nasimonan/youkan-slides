#!/usr/bin/env node

import { watch } from 'fs';
import { spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, resolve, join, relative } from 'path';

const SLIDES_DIR = 'slides';
const PROCESSED_DIR = '.processed';

let marpServer = null;
let isPreprocessing = false;

// Preprocess functions (same as preprocess-all.js)
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

  const relativePath = relative(SLIDES_DIR, inputPath);
  const depth = relativePath.split('/').length - 1;
  const prefix = '../'.repeat(depth + 1);

  let withShortcodes = content;

  // @logo(name) or @logo(name, size)
  withShortcodes = withShortcodes.replace(
    /@logo\(([^,)]+)(?:,\s*(\d+))?\)/g,
    (_match, name, size) => {
      if (size) {
        return `![width:${size}px](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.trim()}/${name.trim()}-plain.svg)`;
      } else {
        return `<!-- @include ${prefix}components/tech-logos.md ${name.trim()} -->`;
      }
    }
  );

  // @intro
  withShortcodes = withShortcodes.replace(/@intro(?!\()/g, `<!-- @include ${prefix}components/self-intro.md intro -->`);
  withShortcodes = withShortcodes.replace(/@intro\(compact\)/g, `<!-- @include ${prefix}components/self-intro.md compact -->`);

  // @closing
  withShortcodes = withShortcodes.replace(/@closing(?!\()/g, `<!-- @include ${prefix}components/closing.md simple -->`);
  withShortcodes = withShortcodes.replace(/@closing\(social\)/g, `<!-- @include ${prefix}components/closing.md social -->`);
  withShortcodes = withShortcodes.replace(/@closing\(qr\)/g, `<!-- @include ${prefix}components/closing.md withqr -->`);

  const processed = processIncludes(withShortcodes, baseDir);

  const outputPath = join(PROCESSED_DIR, relativePath);
  const outputDir = dirname(outputPath);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(outputPath, processed);
  return outputPath;
}

function preprocessAll() {
  if (isPreprocessing) return;

  isPreprocessing = true;
  console.log('🔄 Preprocessing slides...');

  if (!existsSync(PROCESSED_DIR)) {
    mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const files = findMarkdownFiles(SLIDES_DIR);
  let processedCount = 0;

  for (const file of files) {
    try {
      preprocessFile(file);
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log(`✅ Preprocessed ${processedCount} file(s)\n`);
  isPreprocessing = false;
}

function startMarpServer() {
  console.log('🚀 Starting Marp server...\n');

  marpServer = spawn('npx', ['@marp-team/marp-cli', '--server', '--input-dir', PROCESSED_DIR], {
    stdio: 'inherit',
    shell: true
  });

  marpServer.on('error', (error) => {
    console.error('❌ Failed to start Marp server:', error);
    process.exit(1);
  });
}

function main() {
  console.log('👀 Watching slides directory for changes...\n');

  // Initial preprocessing
  preprocessAll();

  // Start Marp server
  startMarpServer();

  // Watch for changes
  const watcher = watch(SLIDES_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`📝 Detected change in ${filename}`);
      preprocessAll();
    }
  });

  // Also watch components directory
  if (existsSync('components')) {
    watch('components', { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        console.log(`📝 Detected change in components/${filename}`);
        preprocessAll();
      }
    });
  }

  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    watcher.close();
    if (marpServer) {
      marpServer.kill();
    }
    process.exit(0);
  });
}

main();
