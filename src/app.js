// Homepage WebGL: brand gradient hero (ShaderGradient-style) + liquid-chrome ZH logo.
// Built to js/app.bundle.js with `npm run build:3d`.
import { Vector2 } from './vendor/three.module.js';
import { createGradient } from './gradient.js';
import { createLogo } from './logo.js';

const ZH = window.ZH || (window.ZH = {});
ZH.mouse = new Vector2(); ZH.temp = 0; ZH.started = true;
ZH.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('pointermove', e => ZH.mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), { passive: true });
try { const g = document.getElementById('heroGL'); if (g) createGradient(g, ZH); } catch { /* CSS gradient fallback stays */ }
const l = document.getElementById('logoGL'); if (l) createLogo(l, ZH).catch(() => { l.replaceWith(Object.assign(document.createElement('img'), { src: 'img/brand-mark.webp', alt: 'ZH Climate Solutions logo' })); });
