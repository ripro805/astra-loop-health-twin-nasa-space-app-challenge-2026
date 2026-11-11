const fs = require('fs');
const path = require('path');

const bnDir = path.join(__dirname, '..', 'docs', 'bn');
const outFile = path.join(bnDir, 'ASTRA-LOOP_সম্পূর্ণ_গাইড.html');

const files = [
  '01_প্রজেক্ট_পরিচিতি.md',
  '02_মহাকাশে_কীভাবে_ব্যবহার_করবেন.md',
  '03_ফিচার_গাইড.md',
  '04_কীভাবে_চালাবেন.md',
  '05_কোড_ও_আর্কিটেকচার_সহজ_ভাষায়.md',
  '06_বিজ্ঞান_ও_মহাকাশ_চিকিৎসা_প্রাইমার.md',
  '07_ইন্টারভিউ_প্রস্তুতি.md',
  '08_শব্দকোষ_Glossary.md',
  '09_সীমাবদ্ধতা_ও_পরবর্তী_ধাপ.md',
  '10_শেখার_পথ_১৪_দিন.md'
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseSimpleMarkdown(md) {
  // Simple custom parser for markdown to HTML
  let lines = md.split(/\r?\n/);
  let html = [];
  let inCodeBlock = false;
  let codeLang = '';
  let inTable = false;
  let tableHeader = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html.push('</code></pre>');
        inCodeBlock = false;
      } else {
        codeLang = line.slice(3).trim();
        html.push(`<pre class="code-block ${codeLang}"><code>`);
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      html.push(escapeHtml(line) + '\n');
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if delimiter row
      if (cells.every(c => c.match(/^:?-+:?$/))) {
        continue;
      }
      if (!inTable) {
        html.push('<div class="table-container"><table>');
        html.push('<thead><tr>' + cells.map(c => `<th>${formatInline(c)}</th>`).join('') + '</tr></thead><tbody>');
        inTable = true;
        tableHeader = true;
        continue;
      } else {
        html.push('<tr>' + cells.map(c => `<td>${formatInline(c)}</td>`).join('') + '</tr>');
        continue;
      }
    } else {
      if (inTable) {
        html.push('</tbody></table></div>');
        inTable = false;
        tableHeader = false;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      html.push(`<h1 id="sec-${i}">${formatInline(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      html.push(`<h2 id="sec-${i}">${formatInline(line.slice(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      html.push(`<h3 id="sec-${i}">${formatInline(line.slice(4))}</h3>`);
    } else if (line.startsWith('#### ')) {
      html.push(`<h4 id="sec-${i}">${formatInline(line.slice(5))}</h4>`);
    } else if (line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]') || line.startsWith('> [!WARNING]')) {
      let type = line.includes('NOTE') ? 'note' : line.includes('TIP') ? 'tip' : 'warning';
      html.push(`<div class="callout ${type}"><strong>${type.toUpperCase()}:</strong> `);
    } else if (line.startsWith('> ')) {
      html.push(`<blockquote>${formatInline(line.slice(2))}</blockquote>`);
    } else if (line.startsWith('---')) {
      html.push('<hr>');
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      html.push(`<li>${formatInline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      let match = line.match(/^(\d+)\.\s(.*)/);
      html.push(`<li value="${match[1]}">${formatInline(match[2])}</li>`);
    } else if (line.trim() === '') {
      html.push('');
    } else {
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inTable) html.push('</tbody></table></div>');
  if (inCodeBlock) html.push('</code></pre>');

  return html.join('\n');
}

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

let fullContentHtml = '';
let tocItems = [];

for (const file of files) {
  const filePath = path.join(bnDir, file);
  if (!fs.existsSync(filePath)) continue;
  const raw = fs.readFileSync(filePath, 'utf8');
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : file;
  const sectionId = file.replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '-');
  
  tocItems.push({ id: sectionId, title });
  fullContentHtml += `\n<section id="${sectionId}" class="doc-module">\n`;
  fullContentHtml += parseSimpleMarkdown(raw);
  fullContentHtml += `\n</section>\n<div class="page-break"></div>\n`;
}

const htmlDoc = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASTRA-LOOP — সম্পূর্ণ বাংলা প্রজেক্ট গাইড ও ইন্টারভিউ নির্দেশিকা</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.2);
      --border: #1f2937;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.8;
      font-size: 16px;
      padding: 0;
      margin: 0;
    }
    header.hero {
      background: linear-gradient(135deg, #0b1528 0%, #172554 100%);
      border-bottom: 2px solid var(--accent);
      padding: 60px 40px;
      text-align: center;
    }
    header.hero h1 {
      font-size: 2.8rem;
      color: #38bdf8;
      margin-bottom: 12px;
      font-weight: 700;
    }
    header.hero p {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 800px;
      margin: 0 auto;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .toc-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px 32px;
      margin-bottom: 50px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
    .toc-card h2 {
      font-size: 1.6rem;
      color: var(--accent);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }
    .toc-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 12px;
    }
    .toc-list a {
      color: #cbd5e1;
      text-decoration: none;
      display: block;
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(255,255,255,0.02);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .toc-list a:hover {
      background: rgba(56, 189, 248, 0.1);
      border-color: var(--accent);
      color: var(--accent);
      transform: translateX(4px);
    }
    .doc-module {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 48px;
      margin-bottom: 60px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 2.2rem;
      color: #67e8f9;
      margin-top: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #0891b2;
      padding-bottom: 10px;
    }
    h2 {
      font-size: 1.6rem;
      color: #38bdf8;
      margin-top: 36px;
      margin-bottom: 16px;
    }
    h3 {
      font-size: 1.3rem;
      color: #a5f3fc;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 16px;
      color: #e2e8f0;
    }
    a {
      color: var(--accent);
      text-decoration: underline;
    }
    ul, ol {
      margin-left: 28px;
      margin-bottom: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    blockquote {
      border-left: 4px solid var(--accent);
      padding: 12px 20px;
      background: rgba(56, 189, 248, 0.05);
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
      color: #cbd5e1;
      font-style: italic;
    }
    .callout {
      border-left: 4px solid var(--warning);
      padding: 16px 20px;
      background: rgba(245, 158, 11, 0.08);
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }
    .callout.tip {
      border-left-color: var(--success);
      background: rgba(16, 185, 129, 0.08);
    }
    .callout.note {
      border-left-color: var(--accent);
      background: rgba(56, 189, 248, 0.08);
    }
    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      background: rgba(255,255,255,0.08);
      padding: 2px 6px;
      border-radius: 4px;
      color: #f472b6;
      font-size: 0.9em;
    }
    pre.code-block {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 16px 20px;
      overflow-x: auto;
      margin: 20px 0;
    }
    pre.code-block code {
      background: transparent;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .table-container {
      overflow-x: auto;
      margin: 24px 0;
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th, td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: #1e293b;
      color: var(--accent);
      font-weight: 600;
      white-space: nowrap;
    }
    tr:nth-child(even) td {
      background: rgba(255,255,255,0.015);
    }
    hr {
      border: none;
      height: 1px;
      background: var(--border);
      margin: 32px 0;
    }
    .page-break {
      page-break-after: always;
    }
    .print-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 14px 24px;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      z-index: 999;
    }
    .print-button:hover {
      background: #0369a1;
      transform: translateY(-2px);
    }
    @media print {
      body {
        background: #fff;
        color: #000;
        font-size: 13pt;
        line-height: 1.6;
      }
      .hero, .toc-card, .print-button {
        display: none !important;
      }
      .doc-module {
        background: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        margin: 0 0 30pt 0;
      }
      h1, h2, h3 {
        color: #000 !important;
        page-break-after: avoid;
      }
      th {
        background: #eee !important;
        color: #000 !important;
      }
      code, pre.code-block {
        background: #f4f4f4 !important;
        color: #000 !important;
        border: 1px solid #ccc !important;
      }
      a {
        color: #000;
        text-decoration: underline;
      }
    }
  </style>
</head>
<body>

  <header class="hero">
    <h1>ASTRA-LOOP: সম্পূর্ণ বাংলা প্রজেক্ট গাইড ও মাস্টার ম্যানুয়াল</h1>
    <p>NASA Space Apps Challenge 2026 — দূর মহাকাশ অভিযানের স্বয়ংক্রিয় অফলাইন ডিজিটাল টুইন ও স্বাস্থ্য সহযোগী</p>
  </header>

  <div class="container">
    <div class="toc-card">
      <h2>📑 বিষয়সূচি (Table of Contents)</h2>
      <ul class="toc-list">
        ${tocItems.map(item => `<li><a href="#${item.id}">👉 ${item.title}</a></li>`).join('\n        ')}
      </ul>
    </div>

    ${fullContentHtml}
  </div>

  <button class="print-button" onclick="window.print()">
    🖨️ PDF / প্রিন্ট করুন
  </button>

</body>
</html>
`;

fs.writeFileSync(outFile, htmlDoc, 'utf8');
console.log('✅ Generated standalone printable HTML guide at: ' + outFile);

