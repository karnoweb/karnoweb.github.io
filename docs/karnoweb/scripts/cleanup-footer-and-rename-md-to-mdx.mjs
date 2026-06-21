#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'docs', 'karnoweb');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules if ever present
      if (entry.name === 'node_modules') continue;
      walk(full, out);
      continue;
    }
    out.push(full);
  }
  return out;
}

function stripFooterSection(markdown) {
  const footerHeading = '## فوتر (Footer Navigation)';
  const idx = markdown.indexOf(footerHeading);
  if (idx === -1) return markdown;

  let trimmed = markdown.slice(0, idx).replace(/\s+$/g, '');

  // If a broken YAML front-matter delimiter was injected and never closed,
  // remove a leading `---` line.
  const frontMatterDelimRegex = /^---\s*$/gm;
  const delims = [...trimmed.matchAll(frontMatterDelimRegex)].map((m) => m.index);
  if (trimmed.startsWith('---') && delims.length === 1) {
    trimmed = trimmed.replace(/^---\s*$/m, '').replace(/\s+$/g, '').trimEnd() + '\n';
  }

  return trimmed;
}

function renameMdToMdx(filePath) {
  if (!filePath.toLowerCase().endsWith('.md')) return;
  const targetPath = filePath.slice(0, -3) + '.mdx';
  if (fs.existsSync(targetPath)) {
    // Avoid overwriting if something already exists.
    throw new Error(`Target already exists: ${targetPath}`);
  }
  fs.renameSync(filePath, targetPath);
}

const allFiles = walk(root).filter((p) => p.toLowerCase().endsWith('.md'));

let cleaned = 0;
let renamed = 0;

for (const filePath of allFiles) {
  const original = fs.readFileSync(filePath, 'utf8');
  const cleanedContent = stripFooterSection(original);
  if (cleanedContent !== original) {
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    cleaned++;
  }
  renameMdToMdx(filePath);
  renamed++;
}

console.log(JSON.stringify({ root, cleaned, renamed }, null, 2));

