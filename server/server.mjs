// ZH Climate Solutions — site server.  npm start  →  http://127.0.0.1:4173
// Serves the public/ folder.
// Serves ONLY the public website files (allowlist) and the /api/chat endpoint.
// Environment variables (never put them in code or in browser files):
//   ANTHROPIC_API_KEY  enables the AI chat (optional)      CLAUDE_MODEL  override model (optional)
//   PORT (default 4173)   HOST (default 127.0.0.1; use 0.0.0.0 on a server behind HTTPS)
//   ALLOWED_ORIGINS    comma-separated extra origins allowed to call /api/chat, e.g. https://www.zhclimatesolutions.ca
//   TRUST_PROXY=1      read the client IP from X-Forwarded-For (only when behind a trusted reverse proxy)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chat, rateLimited } from './chat-core.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || '127.0.0.1';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

// Allowlist: exact, lowercase public paths only. No dot-files, no "..", no source, config or server files.
const PUBLIC = /^\/(?:[a-z0-9-]+\.html|services\/[a-z0-9-]+\/[a-z0-9-]+\.html|config\.js|robots\.txt|assets\/(?:favicon\.svg|css\/(?:style|fonts)\.css|js\/(?:main|chat|kb|app\.bundle)\.js|img\/[a-z0-9-]+\.webp))$/;

// Security headers (mirrored in _headers for static hosting)
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://formspree.io https://api.web3forms.com",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'"
].join('; ');
const SEC = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};
const send = (res, status, body = '', type = 'text/plain; charset=utf-8', extra = {}) => {
  res.writeHead(status, { ...SEC, 'Content-Type': type, ...extra }); res.end(body);
};
const clientIp = req => (process.env.TRUST_PROXY === '1' && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || 'unknown';
const allowedOrigins = new Set([`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`, ...String(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)]);

const server = http.createServer(async (req, res) => {
  let url;
  try { url = new URL(req.url, 'http://x'); } catch { return send(res, 400, 'Bad request'); }

  /* ---------- AI chat API ---------- */
  if (url.pathname === '/api/chat') {
    if (req.method !== 'POST') return send(res, 405, '', 'text/plain', { Allow: 'POST' });
    const origin = req.headers.origin;
    const sameHost = origin && req.headers.host && (origin === `http://${req.headers.host}` || origin === `https://${req.headers.host}`);
    if (origin && !sameHost && !allowedOrigins.has(origin)) return send(res, 403, '{"error":"forbidden"}', 'application/json');
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, '{"error":"json only"}', 'application/json');
    if (rateLimited(clientIp(req))) return send(res, 429, '{"error":"Too many messages. Please wait a minute."}', 'application/json', { 'Retry-After': '60' });
    let raw = '';
    try { for await (const c of req) { raw += c; if (raw.length > 16000) return send(res, 413, '{"error":"too large"}', 'application/json'); } }
    catch { return send(res, 400, '{}', 'application/json'); }
    let body; try { body = JSON.parse(raw); } catch { return send(res, 400, '{"error":"bad json"}', 'application/json'); }
    try { const r = await chat(body); return send(res, r.status, JSON.stringify(r.json), 'application/json', { 'Cache-Control': 'no-store' }); }
    catch (e) { console.error('chat error:', e && e.message); return send(res, 500, '{"error":"server error"}', 'application/json'); }
  }

  /* ---------- static files (allowlist only) ---------- */
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain', { Allow: 'GET, HEAD' });
  const p = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;   // /services/heating/ → its index.html
  if (!PUBLIC.test(p)) return send(res, 404, 'Not found');
  try {
    const buf = await readFile(path.join(root, p));
    const ext = path.extname(p);
    send(res, 200, req.method === 'HEAD' ? '' : buf, mime[ext] || 'application/octet-stream', { 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' });
  } catch { send(res, 404, 'Not found'); }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.on('error', e => { console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is busy. Stop the other server (Ctrl+C in its terminal) or run: set PORT=4174 && npm start` : e.message); process.exit(1); });
server.listen(PORT, HOST, () => console.log(`ZH Climate site running → http://${HOST === '0.0.0.0' ? '127.0.0.1' : HOST}:${PORT}  (Ctrl+C to stop)\nAI assistant: ${process.env.ANTHROPIC_API_KEY ? 'ON (Claude)' : 'built-in answers (set ANTHROPIC_API_KEY to enable AI)'}`));
