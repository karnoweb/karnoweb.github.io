#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const sampleFiles = process.argv.slice(2);

function resolveSectionDocPath(sectionDirName) {
  // A small convention:
  // - Prefer `<section>/overview.md`
  // - Fall back to known special filenames
  const candidates = [
    'overview.md',
    'brand-overview.md',
    'contact-form.md',
    'sitemap.md',
    'footer.md',
    'index.md',
  ];

  for (const file of candidates) {
    const full = path.join(root, sectionDirName, file);
    if (fs.existsSync(full)) return path.posix.join(sectionDirName, file);
  }

  // Last resort: first .md file in the section directory.
  const entries = fs
    .readdirSync(path.join(root, sectionDirName), { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
    .sort();

  if (entries.length > 0) return path.posix.join(sectionDirName, entries[0]);
  return null;
}

function getDestinationsFromCategoryFiles() {
  const entries = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const destinations = [];
  for (const sectionDirName of entries) {
    const categoryPath = path.join(root, sectionDirName, '_category_.json');
    if (!fs.existsSync(categoryPath)) continue;

    const json = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
    const label = json.label;
    const position = typeof json.position === 'number' ? json.position : 9999;
    const docPath = resolveSectionDocPath(sectionDirName);

    if (!label || !docPath) continue;
    destinations.push({ label, path: docPath, position });
  }

  destinations.sort((a, b) => a.position - b.position);
  return destinations.map(({ label, path: p }) => ({ label, path: p }));
}

const destinations = getDestinationsFromCategoryFiles();

function getAllMarkdownFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(root, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (relative === 'docs' || relative.startsWith('docs/') || relative === 'mcps' || relative.startsWith('mcps/')) {
        continue;
      }
      getAllMarkdownFiles(fullPath, files);
      continue;
    }

    if (!entry.name.endsWith('.md')) continue;
    if (relative === 'README.md' || relative === 'AGENTS.md') continue;
    files.push(relative);
  }

  return files.sort();
}

function buildFooter(filePath) {
  const fromDir = path.dirname(filePath);
  // Don't generate `---` here.
  // `---` is the Markdown front-matter delimiter, and without a closing `---`
  // Docusaurus/gray-matter will throw "Error while parsing Markdown front matter".
  const lines = ['', '## فوتر (Footer Navigation)', ''];

  for (const dest of destinations) {
    const relative = path.relative(fromDir, dest.path).replace(/\\/g, '/');
    lines.push(`- [${dest.label}](${relative})`);
  }

  lines.push('');
  return lines.join('\n');
}

function shouldProcess(relativePath) {
  if (sampleFiles.length === 0) return true;
  return sampleFiles.includes(relativePath);
}

let updated = 0;
let skipped = 0;

for (const relativePath of getAllMarkdownFiles(root)) {
  if (!shouldProcess(relativePath)) continue;

  const fullPath = path.join(root, relativePath);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Clean up previously injected broken "front matter start" delimiter
  // like: `---` immediately before the footer heading.
  // This keeps the markdown valid even if the footer was injected before.
  const cleaned = content.replace(/(^|\n)---\s*\n\s*(##\s*فوتر\s*\(Footer Navigation\))/g, '$1$2');

  if (/##\s*فوتر\s*\(Footer Navigation\)/m.test(cleaned)) {
    // If footer already exists, we may still need to remove stray `---`
    // that breaks front matter parsing.
    if (cleaned !== content) {
      fs.writeFileSync(fullPath, cleaned, 'utf8');
      updated++;
    } else {
      skipped++;
    }
    continue;
  }

  const footer = buildFooter(relativePath);
  const trimmed = cleaned.replace(/\s+$/, '');
  const newContent = trimmed.length > 0 ? `${trimmed}\n\n${footer}` : footer;

  fs.writeFileSync(fullPath, newContent, 'utf8');
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
