import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 4321;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm',
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
    if (reqPath.endsWith('/')) {
      reqPath += 'index.html';
    }
    
    let filePath = path.join(DIST_DIR, reqPath);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(filePath, 'index.html');
      if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      } else {
        filePath = path.join(DIST_DIR, '404.html');
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Ready on http://0.0.0.0:${PORT}`);
});
