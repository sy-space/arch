// Preview for the STUDIO proposal, kept apart from dist/.
//   node studio/serve.mjs        -> http://127.0.0.1:4182/
// studio/ holds this proposal's own HTML, CSS and JS. Project data, fonts and media are read
// (never written) from dist/ through /shared/, so both versions always show the same projects.
// Saved studio versions live in ../.compare-studio/<n-name>/ (copies of index.html, style.css, app.js;
// the live one's label is in ../.compare-studio/CURRENT) and get the same bottom-left switch as 4180.
import http from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const own = fileURLToPath(new URL('./', import.meta.url));
const shared = fileURLToPath(new URL('../dist/', import.meta.url));
const compareRoot = fileURLToPath(new URL('../.compare-studio/', import.meta.url));
const compareScript = fileURLToPath(new URL('../scripts/compare.js', import.meta.url));
const port = Number(process.env.PORT || process.argv[2] || 4182);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };

function resolveInside(base, pathname) {
  const filename = path.resolve(base, `.${pathname}`);
  const relative = path.relative(base, filename);
  return relative.startsWith('..') || path.isAbsolute(relative) ? null : filename;
}

http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let base = own;
    if (pathname === '/__compare.js') {
      response.writeHead(200, { 'Content-Type': types['.js'], 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : await readFile(compareScript));
      return;
    }
    if (pathname === '/__compare.json') {
      const entries = await readdir(compareRoot, { withFileTypes: true }).catch(() => []);
      const versions = entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
      const current = (await readFile(`${compareRoot}CURRENT`, 'utf8').catch(() => 'AFTER')).trim();
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ versions, current }));
      return;
    }
    const version = pathname.match(/^\/v\/([a-z0-9-]+)(\/.*)?$/);
    if (version) {
      pathname = version[2] || '/';
      if (!pathname.startsWith('/shared/')) base = `${compareRoot}${version[1]}/`;
    }
    if (pathname.startsWith('/shared/')) {
      base = shared;
      pathname = pathname.slice('/shared'.length);
    } else if (pathname.endsWith('.mjs') || pathname.endsWith('.md')) {
      response.writeHead(404).end('File unavailable');
      return;
    }
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filename = resolveInside(base, pathname);
    if (!filename) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    let body = await readFile(filename);
    if (path.extname(filename) === '.html') body = body.toString('utf8').replace('</body>', '<script src="/__compare.js"></script>\n</body>');
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('File unavailable');
  }
}).on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Try: node studio/serve.mjs 4183` : error.message);
  process.exitCode = 1;
}).listen(port, '127.0.0.1', () => console.log(`STUDIO proposal: http://127.0.0.1:${port}/\nPress Ctrl+C to stop.`));
