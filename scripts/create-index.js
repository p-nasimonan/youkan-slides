#!/usr/bin/env node

import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, relative, basename } from 'path';

const DIST_DIR = 'dist';

function findHtmlFiles(dir, files = [], baseDir = dir) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && item !== 'pdf') {
      findHtmlFiles(fullPath, files, baseDir);
    } else if (item.endsWith('.html') && item !== 'index.html') {
      const relativePath = relative(baseDir, fullPath);
      files.push({
        path: relativePath,
        name: basename(item, '.html'),
        category: relativePath.split('/').slice(0, -1).join('/') || 'root'
      });
    }
  }

  return files;
}

function extractTitle(htmlPath) {
  try {
    const content = readFileSync(htmlPath, 'utf-8');
    const match = content.match(/<title>(.*?)<\/title>/);
    return match ? match[1] : basename(htmlPath, '.html');
  } catch {
    return basename(htmlPath, '.html');
  }
}

function createIndexPage() {
  const files = findHtmlFiles(DIST_DIR);

  // Group by category
  const grouped = {};
  for (const file of files) {
    if (!grouped[file.category]) {
      grouped[file.category] = [];
    }
    const title = extractTitle(join(DIST_DIR, file.path));
    grouped[file.category].push({
      ...file,
      title
    });
  }

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>youkan-slides</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #e0f4f8 0%, #f0e6fa 50%, #fce4ec 100%);
      min-height: 100vh;
    }
    .container {
      background: #fefefe;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    h1 {
      color: #5a6a7a;
      font-size: 2.5em;
      margin-bottom: 0.5rem;
      border-bottom: 4px solid #7dd3e8;
      padding-bottom: 0.5rem;
    }
    .subtitle {
      color: #718096;
      font-size: 1.1em;
      margin-bottom: 2rem;
    }
    .category {
      margin-bottom: 2rem;
    }
    .category h2 {
      color: #5bbdd4;
      font-size: 1.3em;
      margin-bottom: 1rem;
      padding-left: 0.5rem;
      border-left: 4px solid #a5e4f3;
    }
    ul {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    li a {
      display: block;
      color: #4a5568;
      text-decoration: none;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 12px;
      border-left: 4px solid #7dd3e8;
      box-shadow: 0 2px 8px rgba(125, 211, 232, 0.2);
      transition: all 0.3s ease;
    }
    li a:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(125, 211, 232, 0.4);
      border-left-color: #5bbdd4;
    }
    .slide-name {
      font-weight: 600;
      font-size: 1.1em;
      margin-bottom: 0.3rem;
      color: #5a6a7a;
    }
    .slide-path {
      font-size: 0.85em;
      color: #718096;
    }
    footer {
      margin-top: 3rem;
      text-align: center;
      color: #718096;
      font-size: 0.9em;
    }
    footer a {
      color: #5bbdd4;
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 youkan-slides</h1>
    <p class="subtitle">LT・技術発表用スライド集</p>

${Object.entries(grouped).sort().map(([category, slides]) => `
    <div class="category">
      <h2>📁 ${category}</h2>
      <ul>
${slides.map(slide => `        <li>
          <a href="${slide.path}">
            <div class="slide-name">${slide.title}</div>
            <div class="slide-path">${slide.path}</div>
          </a>
        </li>`).join('\n')}
      </ul>
    </div>
`).join('')}

    <footer>
      <p>Built with <a href="https://marp.app/" target="_blank">Marp</a> |
      <a href="https://github.com/youkan/youkan-slides" target="_blank">GitHub</a></p>
    </footer>
  </div>
</body>
</html>`;

  writeFileSync(join(DIST_DIR, 'index.html'), html);
  console.log(`✅ Created index.html with ${files.length} slides`);
}

createIndexPage();
