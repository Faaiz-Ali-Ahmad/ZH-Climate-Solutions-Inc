// npm run dist → copies ONLY the public website into dist/ (for static hosts like Netlify or Cloudflare Pages).
// Source code, the server, the API and the build folder are never included.
import { cpSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), out = path.join(root, 'dist');
rmSync(out, { recursive: true, force: true }); mkdirSync(path.join(out, 'js'), { recursive: true });
const files = [...readdirSync(root).filter(f => f.endsWith('.html')), 'style.css', 'fonts.css', 'config.js', 'favicon.svg', 'robots.txt', '_headers',
  'js/main.js', 'js/chat.js', 'js/kb.js', 'js/app.bundle.js'];
for (const f of files) cpSync(path.join(root, f), path.join(out, f));
cpSync(path.join(root, 'img'), path.join(out, 'img'), { recursive: true });
console.log(`dist/ ready: ${files.length} files + img/`);
