import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const BACKUP = path.resolve(__dirname, '..', 'public_backup');
const MAX_WIDTH = 1920;
const MIN_SIZE_BYTES = 500 * 1024;
const JPEG_QUALITY = 80;

const RASTER_EXTS = new Set(['.png', '.jpg', '.jpeg']);

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else files.push(full);
  }
  return files;
}

async function ensureBackup(srcAbs) {
  const rel = path.relative(PUBLIC, srcAbs);
  const dest = path.join(BACKUP, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    await fs.access(dest);
  } catch {
    await fs.copyFile(srcAbs, dest);
  }
  return dest;
}

function fmt(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function compressRaster(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER_EXTS.has(ext)) return null;

  const stat = await fs.stat(file);
  if (stat.size < MIN_SIZE_BYTES) return null;

  await ensureBackup(file);

  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;
  let pipeline = sharp(file, { failOn: 'none' });
  if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });

  let outBuf;
  if (ext === '.png') {
    outBuf = await pipeline.png({ compressionLevel: 9, palette: true, quality: 85, effort: 8 }).toBuffer();
  } else {
    outBuf = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }

  if (outBuf.length >= stat.size) {
    return { file, before: stat.size, after: stat.size, skipped: true };
  }

  await fs.writeFile(file, outBuf);
  return { file, before: stat.size, after: outBuf.length };
}

async function convertHeic(file) {
  const stat = await fs.stat(file);
  await ensureBackup(file);
  const out = file.replace(/\.HEIC$/i, '.jpg');
  execSync(`sips -s format jpeg -s formatOptions ${JPEG_QUALITY} -Z ${MAX_WIDTH} "${file}" --out "${out}" >/dev/null 2>&1`);
  await fs.unlink(file);
  const newStat = await fs.stat(out);
  return { file, out, before: stat.size, after: newStat.size, converted: true };
}

async function main() {
  const all = await walk(PUBLIC);
  const heicFiles = all.filter(f => /\.HEIC$/i.test(path.extname(f)));
  const rasterFiles = all.filter(f => RASTER_EXTS.has(path.extname(f).toLowerCase()));

  let totalBefore = 0, totalAfter = 0;
  const rows = [];

  for (const f of heicFiles) {
    const r = await convertHeic(f);
    totalBefore += r.before;
    totalAfter += r.after;
    rows.push(`HEIC→JPG  ${path.relative(PUBLIC, f).padEnd(50)}  ${fmt(r.before)} → ${fmt(r.after)}`);
  }

  for (const f of rasterFiles) {
    try {
      const r = await compressRaster(f);
      if (!r) continue;
      totalBefore += r.before;
      totalAfter += r.after;
      const label = r.skipped ? 'skip      ' : 'compress  ';
      rows.push(`${label}${path.relative(PUBLIC, f).padEnd(50)}  ${fmt(r.before)} → ${fmt(r.after)}`);
    } catch (e) {
      rows.push(`error     ${path.relative(PUBLIC, f)}: ${e.message}`);
    }
  }

  console.log(rows.join('\n'));
  console.log('—'.repeat(80));
  console.log(`Total: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% reducción)`);
  console.log(`Backups en: ${BACKUP}`);
}

main().catch(e => { console.error(e); process.exit(1); });
