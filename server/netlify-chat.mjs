// Optional: Netlify Function wrapper (publish directory: public). Move to netlify/functions/chat.mjs when deploying on Netlify,
// set ANTHROPIC_API_KEY in Site settings → Environment variables, and set aiEndpoint to "/.netlify/functions/chat" in config.js.
import { chat, rateLimited } from '../../server/chat-core.mjs';  // path is correct once this file is at netlify/functions/chat.mjs
export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (rateLimited(context.ip || 'x')) return Response.json({ error: 'slow down' }, { status: 429 });
  const r = await chat(await req.json().catch(() => ({})));
  return Response.json(r.json, { status: r.status });
};
