// ZH Climate — AI assistant backend (Claude). Used by server/server.mjs and server/netlify-chat.mjs.
// Needs the environment variable ANTHROPIC_API_KEY. Optional: CLAUDE_MODEL (default claude-haiku-5-5).
// The API key stays on the server — never put it in config.js or any browser file.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
let KB; try { KB = JSON.parse(readFileSync(path.join(here, 'kb.json'), 'utf8')); } catch { KB = null; }

function systemPrompt() {
  const k = KB, c = k.company;
  return `You are the website assistant for ${c.name}, a heating, cooling, plumbing and electrical company based in ${c.base}, serving Brampton, the GTA and communities across Ontario.
Phone: ${c.phone} (24/7 emergency service). Email: ${c.email}.
Company promises (only these): ${k.trust.join('; ')}.

SERVICES (with page links you may mention by filename):
${k.services.map(s => `- ${s.title} (${s.url}): ${s.lede} Sub-services: ${s.subs.map(x => `${x.t} (${x.url})`).join('; ')}`).join('\n')}

SERVICE AREAS: ${k.areas.map(a => `${a.r}: ${a.c.join(', ')}`).join(' | ')}. Other towns: ask for the postal code; the team confirms availability.
BRANDS WE WORK WITH: ${k.brands.map(b => b.n).join(', ')} — plus most other makes and models.
FAQ:
${[...k.faqs, ...k.services.flatMap(s => s.faqs)].map(f => `Q: ${f.q} A: ${f.a}`).join('\n')}

RULES
- Be warm, brief and plain-spoken: 1–4 short sentences. Canadian spelling. No markdown headings or lists; you may use **bold** sparingly.
- Only use the facts above. Never invent prices, timelines, discounts, warranties, financing, licence numbers or availability. For prices say estimates are free and pricing is explained before work starts.
- Your goal is to help the visitor choose the right service and book. Suggest booking when it fits.
- Safety: gas smell → leave the building and call the gas utility's emergency line or 911 from outside. CO alarm → get outside and call 911. Sparks/burning/smoke → 911 if fire, otherwise call ZH now. Floods/burst pipes → shut the main water valve and call ZH.
- Never collect payment or card details. You may not confirm appointments — the team confirms by phone or email.
- If a question is unrelated to home services or this company, politely steer back.
Respond ONLY with JSON: {"reply": string, "service": one of ${JSON.stringify(k.services.map(s => s.book))} or "", "book": boolean, "call": boolean}`;
}

// Per-visitor limit: 12 messages per minute. Old entries are pruned so memory stays small.
const hits = new Map();
export function rateLimited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 60000);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < 60000)) hits.delete(k);
  return list.length > 12;
}
// Site-wide cap on AI calls per hour (protects the API bill). Override with AI_HOURLY_LIMIT.
const HOURLY = Number(process.env.AI_HOURLY_LIMIT) || 300;
let windowStart = Date.now(), used = 0;
function budgetOk() {
  if (Date.now() - windowStart > 3600000) { windowStart = Date.now(); used = 0; }
  return ++used <= HOURLY;
}

export async function chat(body) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !KB) return { status: 503, json: { error: 'AI not configured' } };
  if (!budgetOk()) return { status: 503, json: { error: 'busy' } };
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  const messages = msgs.slice(-12)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 800) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') return { status: 400, json: { error: 'bad request' } };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    signal: AbortSignal.timeout(20000),
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.CLAUDE_MODEL || 'claude-haiku-5-5', max_tokens: 400, system: systemPrompt(), messages })
  });
  if (!r.ok) { console.error('Claude API error', r.status); return { status: 502, json: { error: 'upstream' } }; }
  const data = await r.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
  let out; try { out = JSON.parse(text.replace(/^```(?:json)?|```$/g, '').trim()); } catch { out = { reply: text }; }
  return { status: 200, json: { reply: String(out.reply || '').slice(0, 1200), service: out.service || '', book: !!out.book, call: !!out.call } };
}
