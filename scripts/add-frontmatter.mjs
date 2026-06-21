import fs from 'fs';
import path from 'path';

/**
 * Recursively walk a directory and return all .mdx files.
 */
function getMdxFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getMdxFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Base docs folder
const baseDir = path.resolve('docs/karnoweb');
const mdxFiles = getMdxFiles(baseDir);

mdxFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check if front‑matter already contains an id field
    const hasId = /^---\s*\n(?:[^\n]*\n)*?id:/m.test(content);
    if (hasId) return; // skip files that already have proper front‑matter

    // Derive id and slug from relative path
    const relPath = path.relative(baseDir, filePath);
    const withoutExt = relPath.replace(/\.mdx$/, '');
    const id = withoutExt.replace(/[/\\]/g, '-').replace(/\s+/g, '-');
    const slug = `/karnoweb/${withoutExt.replace(/\\/g, '/')}`;
    const title = withoutExt
        .split(/[\\/]/)
        .pop()
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const frontMatter = `---\nid: ${id}\ntitle: ${title}\nslug: ${slug}\n---\n\n`;
    fs.writeFileSync(filePath, frontMatter + content, 'utf8');
    console.log(`Added front‑matter to ${filePath}`);
});

console.log('Front‑matter addition complete.');