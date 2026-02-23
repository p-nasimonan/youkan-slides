#!/usr/bin/env node

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const SLIDES_DIR = 'slides';

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

function extractTitle(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Look for first h1 heading after frontmatter
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : '(タイトルなし)';
  } catch {
    return '(読み取りエラー)';
  }
}

function extractFooter(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/footer:\s*['"]?(.+?)['"]?\s*$/m);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
}

function main() {
  console.log('\n📚 スライド一覧\n');
  console.log('=' .repeat(60));

  const files = findMarkdownFiles(SLIDES_DIR);

  if (files.length === 0) {
    console.log('スライドが見つかりません。');
    return;
  }

  // Group by category
  const grouped = {};
  for (const file of files) {
    const relativePath = relative(SLIDES_DIR, file);
    const parts = relativePath.split('/');
    const category = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';

    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({
      path: file,
      relativePath,
      title: extractTitle(file),
      footer: extractFooter(file),
    });
  }

  // Display
  for (const [category, slides] of Object.entries(grouped).sort()) {
    console.log(`\n📁 ${category}/`);
    console.log('-'.repeat(40));

    for (const slide of slides) {
      console.log(`  📄 ${slide.relativePath}`);
      console.log(`     タイトル: ${slide.title}`);
      if (slide.footer) {
        console.log(`     フッター: ${slide.footer}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`合計: ${files.length} スライド\n`);
}

main();
