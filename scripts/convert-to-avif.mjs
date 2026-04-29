import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MIN_SIZE_BYTES = 200 * 1024;
const AVIF_QUALITY = 60;
const TARGETS = new Set(['.png', '.jpg', '.jpeg']);
const SKIP_NAMES = new Set(['favicon.svg', 'favicon.ico', 'logo-byjeka.png', 'claude-ai-icon.png']);

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else files.push(full);
  }
  return files;
}

function fmt(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function convertOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!TARGETS.has(ext)) return null;
  const base = path.basename(file);
  if (SKIP_NAMES.has(base)) return null;
  const stat = await fs.stat(file);
  if (stat.size < MIN_SIZE_BYTES) return null;

  const out = file.replace(/\.(png|jpg|jpeg)$/i, '.avif');
  const buf = await sharp(file, { failOn: 'none' }).avif({ quality: AVIF_QUALITY, effort: 6 }).toBuffer();
  await fs.writeFile(out, buf);
  return { file, out, before: stat.size, after: buf.length };
}

async function updateReferences(replacements) {
  // Walk src/ and replace string occurrences in .md, .astro, .ts files.
  const targets = ['src/content/projects', 'src/pages', 'src/components', 'src/layouts'];
  const exts = new Set(['.md', '.astro', '.ts', '.tsx', '.js', '.mjs']);
  let touched = 0;
  for (const t of targets) {
    const dir = path.join(PROJECT_ROOT, t);
    let entries;
    try { entries = await walk(dir); } catch { continue; }
    for (const file of entries) {
      if (!exts.has(path.extname(file))) continue;
      let content = await fs.readFile(file, 'utf8');
      let changed = false;
      for (const [oldRel, newRel] of replacements) {
        if (content.includes(oldRel)) {
          content = content.split(oldRel).join(newRel);
          changed = true;
        }
      }
      if (changed) {
        await fs.writeFile(file, content);
        touched++;
      }
    }
  }
  return touched;
}

async function main() {
  const all = await walk(PUBLIC);
  const targets = all.filter(f => TARGETS.has(path.extname(f).toLowerCase()));

  let totalBefore = 0, totalAfter = 0;
  const rows = [];
  const replacements = [];

  for (const f of targets) {
    try {
      const r = await convertOne(f);
      if (!r) continue;
      totalBefore += r.before;
      totalAfter += r.after;
      const oldRel = '/' + path.relative(PUBLIC, r.file).split(path.sep).join('/');
      const newRel = '/' + path.relative(PUBLIC, r.out).split(path.sep).join('/');
      replacements.push([oldRel, newRel]);
      rows.push(`avif      ${oldRel.padEnd(50)}  ${fmt(r.before)} → ${fmt(r.after)}`);
      // Delete the original
      await fs.unlink(r.file);
    } catch (e) {
      rows.push(`error     ${path.relative(PUBLIC, f)}: ${e.message}`);
    }
  }

  console.log(rows.join('\n'));
  console.log('—'.repeat(80));
  console.log(`Total: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% reducción)`);

  const touched = await updateReferences(replacements);
  console.log(`References updated in ${touched} source files.`);
}

main().catch(e => { console.error(e); process.exit(1); });
