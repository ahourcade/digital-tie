// Servidor local para probar sin Vercel: sirve los archivos y ejecuta /api/* con almacenamiento en .localdata/
// Uso: npm run dev  → http://localhost:4400/organizador-goat-padel/
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = '/organizador-goat-padel/';
const PORT = Number(process.env.PORT || 4400);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/organizador-goat-padel') { res.writeHead(308, { location: BASE + url.search }); return res.end(); }
    if (!url.pathname.startsWith(BASE)) { res.writeHead(404); return res.end('fuera de la app'); }
    const rel = url.pathname.slice(BASE.length);

    if (rel.startsWith('api/')) {
      const name = rel.slice(4).replace(/\/$/, '');
      if (!/^[a-z]+$/.test(name)) { res.writeHead(404); return res.end(); }
      const mod = await import(pathToFileURL(path.join(ROOT, 'api', `${name}.js`)).href);
      const handler = mod[req.method];
      if (!handler) { res.writeHead(405); return res.end(); }
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      return res.end(Buffer.from(await response.arrayBuffer()));
    }

    const file = path.join(ROOT, rel === '' ? 'index.html' : rel);
    if (!file.startsWith(ROOT) || file.includes('node_modules') || file.includes('.localdata')) { res.writeHead(404); return res.end(); }
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500);
    res.end(String(e.message));
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}`));
