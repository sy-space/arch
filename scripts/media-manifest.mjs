// Lists every file in dist/assets (with pixel sizes for images) into the MEDIA block of dist/content.js.
// Run it after adding, renaming or removing media:   node scripts/media-manifest.mjs
// content.js then shows only files that exist: a missing image falls back to the blurred placeholder,
// missing pages and PDFs are left out, and each image gets its width and height so long pages do not jump.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const contentFile = fileURLToPath(new URL('../dist/content.js', import.meta.url));

function imageSize(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
    }
    if (chunk === 'VP8 ') return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let i = 2;
    while (i < buffer.length - 9) {
      if (buffer[i] !== 0xff) { i += 1; continue; }
      const marker = buffer[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [buffer.readUInt16BE(i + 7), buffer.readUInt16BE(i + 5)];
      }
      i += 2 + buffer.readUInt16BE(i + 2);
    }
  }
  return null;
}

async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (!entry.name.startsWith('.')) files.push(full);
  }
  return files;
}

const media = {};
for (const file of (await walk(assets)).sort()) {
  const key = path.relative(assets, file).split(path.sep).join('/');
  media[key] = /\.(jpe?g|png|webp)$/i.test(key) ? imageSize(await readFile(file)) : 0;
}

const lines = Object.entries(media).map(([key, size]) => `  ${JSON.stringify(key)}: ${JSON.stringify(size)},`);
const block = `// BEGIN MEDIA (written by scripts/media-manifest.mjs; do not edit by hand)\nconst availableMedia = {\n${lines.join('\n')}\n};\n// END MEDIA`;
const source = await readFile(contentFile, 'utf8');
const pattern = /\/\/ BEGIN MEDIA[\s\S]*?\/\/ END MEDIA/;
if (!pattern.test(source)) throw new Error('content.js has no BEGIN MEDIA / END MEDIA block.');
await writeFile(contentFile, source.replace(pattern, block));
console.log(`Listed ${lines.length} files from dist/assets in dist/content.js.`);
