#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { createInterface } from 'readline';

const TEMPLATES = {
  'base': 'templates/base.md',
  'lt': 'templates/lt-5min.md',
  'tech': 'templates/tech-intro.md',
};

const CATEGORIES = [
  'homelab',
  'kubernetes',
  'devops',
  'personal',
  'events/infra-meetup',
  'events/engineer-meetup',
];

function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function formatDate() {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
}

async function main() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n📝 新しいスライドを作成します\n');

  // Template selection
  console.log('テンプレートを選択:');
  Object.keys(TEMPLATES).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  const templateIndex = parseInt(await question(rl, '番号を入力 (1): ')) || 1;
  const templateKey = Object.keys(TEMPLATES)[templateIndex - 1] || 'base';
  const templatePath = TEMPLATES[templateKey];

  // Category selection
  console.log('\nカテゴリを選択:');
  CATEGORIES.forEach((cat, i) => {
    console.log(`  ${i + 1}. ${cat}`);
  });
  const catIndex = parseInt(await question(rl, '番号を入力 (1): ')) || 1;
  const category = CATEGORIES[catIndex - 1] || CATEGORIES[0];

  // File name
  const fileName = await question(rl, '\nファイル名 (拡張子なし): ');
  if (!fileName) {
    console.log('ファイル名は必須です');
    rl.close();
    process.exit(1);
  }

  // Title
  const title = await question(rl, 'スライドタイトル: ') || 'タイトル';

  // Author
  const author = await question(rl, '発表者名 (youkan): ') || 'youkan';

  // Event name
  const eventName = await question(rl, 'イベント名: ') || '';

  rl.close();

  // Generate file
  const outputDir = join('slides', category);
  const outputPath = join(outputDir, `${fileName}.md`);

  if (existsSync(outputPath)) {
    console.log(`\n❌ ファイルが既に存在します: ${outputPath}`);
    process.exit(1);
  }

  // Create directory if needed
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Read template and replace placeholders
  let content = readFileSync(templatePath, 'utf-8');
  content = content.replace(/\{\{title\}\}/g, title);
  content = content.replace(/\{\{subtitle\}\}/g, '');
  content = content.replace(/\{\{author\}\}/g, author);
  content = content.replace(/\{\{date\}\}/g, formatDate());
  content = content.replace(/\{\{event_name\}\}/g, eventName);
  content = content.replace(/\{\{organization\}\}/g, '');
  content = content.replace(/\{\{interests\}\}/g, '');
  content = content.replace(/\{\{social\}\}/g, `@${author}`);
  content = content.replace(/\{\{agenda_1\}\}/g, 'アジェンダ1');
  content = content.replace(/\{\{agenda_2\}\}/g, 'アジェンダ2');
  content = content.replace(/\{\{agenda_3\}\}/g, 'アジェンダ3');

  writeFileSync(outputPath, content);

  console.log(`\n✅ スライドを作成しました: ${outputPath}`);
  console.log('\n次のステップ:');
  console.log(`  1. エディタで ${outputPath} を編集`);
  console.log('  2. pnpm dev:server でプレビュー');
  console.log('  3. pnpm build でビルド');
}

main().catch(console.error);
