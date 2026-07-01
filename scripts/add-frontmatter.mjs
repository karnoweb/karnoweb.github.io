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
    // Always (re)write front‑matter to ensure sidebar_position and title updates

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

    // Determine sidebar_position: overview pages get 1, others get 0 (can be adjusted later)
    const isOverview = /overview$/i.test(path.basename(filePath, '.mdx'));
    const sidebarPosition = isOverview ? 1 : 0;
    // Title translation placeholder – keep original title for now (could be replaced manually)
    const frontMatter = `---\nid: ${id}\ntitle: ${title}\nslug: ${slug}\nsidebar_position: ${sidebarPosition}\n---\n\n`;
    fs.writeFileSync(filePath, frontMatter + content, 'utf8');
    console.log(`Added front‑matter to ${filePath}`);
});

console.log('Front‑matter addition complete.');