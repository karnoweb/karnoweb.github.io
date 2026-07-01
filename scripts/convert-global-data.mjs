import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('docs/karnoweb/01-global/data.text');
const outDir = path.resolve('docs/karnoweb/01-global');
const raw = fs.readFileSync(dataPath, 'utf8').replace(/\r\n/g, '\n');

const titles = {
  animations: 'انیمیشن‌ها',
  'conversion-funnel': 'قیف تبدیل',
  'cta-strategy': 'استراتژی CTA',
  footer: 'فوتر',
  header: 'هدر',
  'lead-generation': 'جذب و پرورش لید',
  navigation: 'سیستم ناوبری',
  pricing: 'قیمت‌گذاری',
  'responsive-strategy': 'استراتژی ریسپانسیو',
  'seo-strategy': 'استراتژی سئو',
  sitemap: 'نقشه سایت',
};

const positions = {
  sitemap: 1,
  navigation: 2,
  header: 3,
  footer: 4,
  'conversion-funnel': 5,
  'cta-strategy': 6,
  'lead-generation': 7,
  'seo-strategy': 8,
  pricing: 9,
  animations: 10,
  'responsive-strategy': 11,
};

const sections = raw.split(/\n---\n\n## 01-global\//);
let count = 0;

for (let i = 1; i < sections.length; i++) {
  const part = sections[i];
  const slugMatch = part.match(/^([\w-]+)\.md[^\n]*\n/);
  if (!slugMatch) {
    console.warn(`Skipping section ${i}: no slug found`);
    continue;
  }

  const slug = slugMatch[1];
  const mdMarker = '\n\n```md\n';
  const mdStart = part.indexOf(mdMarker);
  if (mdStart === -1) {
    console.warn(`Skipping ${slug}: no md block`);
    continue;
  }

  const contentStart = mdStart + mdMarker.length;
  const contentEnd = part.lastIndexOf('\n```');
  if (contentEnd <= contentStart) {
    console.warn(`Skipping ${slug}: no closing fence`);
    continue;
  }

  let content = part.slice(contentStart, contentEnd);
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(/\n---\n\n## فوتر \(Footer Navigation\)\n\n(- *\n?)+$/s, '').trim();

  const title = titles[slug] ?? slug;
  const sidebarPosition = positions[slug] ?? 0;

  const frontMatter = `---
id: 01-global-${slug}
title: ${title}
slug: /karnoweb/01-global/${slug}
sidebar_position: ${sidebarPosition}
---

`;

  const outPath = path.join(outDir, `${slug}.mdx`);
  fs.writeFileSync(outPath, frontMatter + content + '\n', 'utf8');
  console.log(`Wrote ${slug}.mdx (${content.length} chars)`);
  count++;
}

console.log(`Done: ${count} files converted.`);
