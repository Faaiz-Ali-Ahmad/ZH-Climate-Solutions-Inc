/* ZH Climate — assistant chat
   Built-in knowledge engine (works everywhere, no setup) + optional AI mode via config.aiEndpoint (/api/chat). */
(() => {
  const KB = window.ZH_KB, CFG = window.ZH_CONFIG || {};
  const root = document.querySelector('.chat'); if (!root || !KB) return;
  const $ = (s, r = root) => r.querySelector(s);
  const launcher = $('.chat__launcher'), panel = $('.chat__panel'), log = $('.chat__log'), chips = $('.chat__chips'), form = $('.chat__form'), input = $('#chat-input'), modeEl = $('.chat__mode');
  const C = KB.company, TEL = 'tel:' + C.tel;
  const ROOT = document.documentElement.dataset.root || '';   // path back to the site root from this page
  const isAbs = h => /^(tel:|mailto:|https?:|#)/.test(h);
  const link = h => isAbs(h) ? `href="${h}"` : `href="${ROOT}${h}" data-href="${h}"`;   // data-href keeps links valid when the chat is restored on another page
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICON = {
    phone: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    cal: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
  };
  let history = [], aiOff = location.protocol === 'file:' || CFG.aiEndpoint === '' || CFG.aiEndpoint === false, busy = false;
  // short-term memory: what we last asked and offered, so one-word replies ("repair", "yes") make sense
  let ctx = { visit: null, awaiting: null, offer: null };
  const save = () => { try { sessionStorage.setItem('zh-chat', log.innerHTML); sessionStorage.setItem('zh-chat-h', JSON.stringify(history.slice(-20))); sessionStorage.setItem('zh-chat-c', JSON.stringify(ctx)); sessionStorage.setItem('zh-chat-chips', chips.innerHTML); } catch {} };
  const clearStore = () => { try { ['zh-chat', 'zh-chat-h', 'zh-chat-c', 'zh-chat-chips'].forEach(k => sessionStorage.removeItem(k)); } catch {} };

  /* ---------- UI ---------- */
  const setOpen = o => {
    panel.hidden = !o; root.classList.toggle('open', o); document.body.classList.toggle('chat-open', o); launcher.setAttribute('aria-expanded', o);
    if (o) { if (!log.children.length) greet(); setTimeout(() => input.focus(), 60); } else launcher.focus({ preventScroll: true });
  };
  // Start over: wipes the conversation on screen and in this tab's storage
  function reset() { log.innerHTML = ''; chips.innerHTML = ''; history = []; ctx = { visit: null, awaiting: null, offer: null }; input.value = ''; clearStore(); modeEl.textContent = 'Answers about services, areas and booking'; }
  // Closing with ✕ / Esc ends the chat; following a link inside the chat keeps it for the next page
  const endChat = () => { setOpen(false); reset(); };
  launcher.addEventListener('click', () => setOpen(true));
  $('.chat__x').addEventListener('click', endChat);
  const newBtn = $('.chat__new'); if (newBtn) newBtn.addEventListener('click', () => { reset(); greet(); input.focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) endChat(); });

  function bubble(html, who = 'bot', cls = '') {
    const d = document.createElement('div'); d.className = `msg msg--${who} ${cls}`; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function actions(list) { return `<div class="msg__actions">${list.map(a => a.href ? `<a ${link(a.href)} class="${a.hot ? 'hot' : ''}" ${a.data || ''}>${a.icon ? ICON[a.icon] : ''}${esc(a.label)}</a>` : `<button type="button" class="${a.hot ? 'hot' : ''}" data-act="${a.act}" data-arg="${esc(a.arg || '')}" data-arg2="${esc(a.arg2 || '')}">${a.icon ? ICON[a.icon] : ''}${esc(a.label)}</button>`).join('')}</div>`; }
  function setChips(list) { chips.innerHTML = list.map(t => `<button type="button">${esc(t)}</button>`).join(''); }
  chips.addEventListener('click', e => { const b = e.target.closest('button'); if (b) send(b.textContent); });
  log.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    if (b.dataset.act === 'book') { if (window.ZH_book) { const stay = window.ZH_book(b.dataset.arg, b.dataset.arg2); if (stay && innerWidth < 640) setOpen(false); } else location.href = 'book.html'; }
    if (b.dataset.act === 'callback' && window.ZH_openConsult) { setOpen(false); window.ZH_openConsult(); }
    if (b.dataset.act === 'ask') send(b.dataset.arg);
  });
  const linkify = t => esc(t).replace(/\b((?:services\/[a-z0-9-]+\/)?[a-z0-9-]+\.html)\b/g, (m, h) => `<a ${link(h)}>${h}</a>`).replace(/(\b647-614-4019\b)/g, `<a href="${TEL}">$1</a>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  function greet() {
    bubble(`Hi, I'm the ZH Climate assistant. I can help you find the right service, check if we cover your area, or book a visit.\n\nWhat can I help with today?`);
    setChips(['Book a service', 'Do you serve my area?', 'I have an emergency', 'Brands you work with', 'Are estimates free?', 'Furnace repair']);
    save();
  }

  /* ---------- built-in knowledge engine ---------- */
  const SVC_WORDS = {
    heating: ['furnace', 'heating', 'boiler', 'radiator', 'thermostat', 'no heat', 'not heating', 'cold house', 'hydronic', 'radiant'],
    cooling: ['air condition', ' ac ', 'a/c', 'cooling', 'central air', 'not cooling', 'mini split', 'mini-split', 'ductless ac'],
    'heat-pumps': ['heat pump', 'dual fuel', 'dual-fuel', 'hybrid', 'cold climate', 'cold-climate', 'rebate'],
    'ventilation-air-quality': ['air & ventilation', 'air and ventilation', 'range hood', 'hood', 'exhaust', 'duct', 'ventilat', 'humidif', 'dehumid', 'air quality', 'purifier', 'hepa', 'hrv', 'erv', 'allerg', 'dust', 'bathroom fan', 'filter'],
    'water-heaters': ['water heater', 'hot water', 'tankless', 'water tank'],
    'water-treatment': ['water treatment', 'softener', 'hard water', 'reverse osmosis', ' ro ', 'water filter', 'filtration', 'uv ', 'well water', 'drinking water'],
    plumbing: ['plumb', 'leak', 'pipe', 'drain', 'clog', 'toilet', 'faucet', ' tap', 'sink', 'shut off', 'shut-off', 'valve', 'sewer', 'backed up'],
    electrical: ['electric', 'breaker', 'panel', 'outlet', 'wiring', 'pot light', 'lighting', ' light', 'ev charger', 'charger', 'generator', 'power', 'gfci', 'switch'],
    commercial: ['commercial', 'business', 'restaurant', 'office', 'store', 'retail', 'property manag', 'plaza', 'landlord'],
    'maintenance-plans': ['maintenance', 'tune up', 'tune-up', 'tuneup', 'check up', 'checkup', 'annual service', 'inspection', 'service plan']
  };
  const cities = KB.areas.flatMap(a => a.c.map(c => ({ c, r: a.r })));
  const svcBy = slug => KB.services.find(s => s.slug === slug);
  const has = (t, re) => re.test(t);

  // keyword → regex: short words (ac, erv, uv…) must match whole words; longer ones match as word prefixes (ventilat → ventilation)
  const kwCache = {};
  const kw = w => kwCache[w] || (kwCache[w] = (() => { const k = w.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return new RegExp(w.trim().length <= 4 ? `\\b${k}\\b` : `\\b${k}`); })());
  function detectService(t) {
    let best = null, score = 0;
    for (const [slug, words] of Object.entries(SVC_WORDS)) {
      let s = 0; for (const w of words) if (kw(w).test(t)) s += w.trim().length > 4 ? 2 : 1;
      if (slug === 'heating' && t.includes('heat pump')) s -= 2;
      if (s > score) { score = s; best = slug; }
    }
    return best ? svcBy(best) : null;
  }
  function pickSub(svc, t) {
    const want = /install|new|replace|upgrade|add/.test(t) ? /install|new|replace|system|ductless|ducted|tankless/i : /repair|broken|fix|not working|noise|leak|stopped|won.?t/.test(t) ? /repair|troubleshoot|leak/i : /maint|tune|clean|check|flush/.test(t) ? /maint|tune|flush/i : null;
    // ignore words that are just the service's own name ("plumbing", "water heater"), so a bare service name shows the overview
    const own = new Set(`${svc.name} ${svc.nav} ${svc.title} service services system systems`.toLowerCase().split(/\W+/));
    const words = t.split(/\W+/).filter(w => w.length > 3 && !own.has(w) && !own.has(w.replace(/s$/, '')));
    let best = null, sc = 0;
    for (const s of svc.subs) {
      let x = words.filter(w => s.t.toLowerCase().includes(w)).length * 2;
      if (want && want.test(s.t)) x += 2;
      if (x > sc) { sc = x; best = s; }
    }
    return sc >= 2 ? best : null;
  }
  const VISIT_HINT_OK = t => /install|new|replace|upgrade|repair|fix|broken|maint|tune|check|flush/.test(t);
  const visitOf = t => /install|new|replace|upgrade/.test(t) ? 'New installation' : /maint|tune|check|flush|servic/.test(t) ? 'Maintenance / tune-up' : /estimate|quote|price/.test(t) ? 'Free estimate' : 'Repair';

  function local(raw) {
    const t = ' ' + raw.toLowerCase().replace(/[’']/g, "'") + ' ';
    // safety first
    if (has(t, /smell (of )?gas|gas smell|smells? like gas|rotten egg|gas leak/))
      return { warn: true, html: `**If you smell gas, leave the building now.** Don't use light switches, phones or anything that could spark inside. From outside, call your gas utility's emergency line or 911.\n\nOnce everyone is safe, we can help with repairs — call us 24/7.`, acts: [{ label: `Call ${C.phone}`, href: TEL, icon: 'phone', hot: true }] };
    if (has(t, /carbon monoxide|co (alarm|detector)|co is (beeping|going off)/))
      return { warn: true, html: `**If your carbon monoxide alarm is sounding, get everyone outside to fresh air and call 911.** Don't go back in until emergency responders say it's safe.\n\nAfterwards, we can inspect your furnace and appliances.`, acts: [{ label: `Call ${C.phone}`, href: TEL, icon: 'phone', hot: true }] };
    if (has(t, /sparks?|burning smell|smell(s)? (of )?burning|smoke from|outlet (is )?hot|electrical fire/))
      return { warn: true, html: `That could be an electrical hazard. If there's smoke or fire, leave and call 911. Otherwise, switch off that circuit at the panel if it's safe to do so, and call us now — we offer 24/7 emergency electrical service.`, acts: [{ label: `Call ${C.phone}`, href: TEL, icon: 'phone', hot: true }] };
    if (has(t, /emergenc|urgent|burst|flood|water everywhere|no heat|not heating|furnace (stopped|died|is dead)|no hot water|sewer back|right now|asap/)) {
      const svc = detectService(t);
      return { warn: true, html: `For urgent problems, calling is fastest — we offer **24/7 emergency service** at ${C.phone}.${/burst|flood|leak|water everywhere/.test(t) ? '\n\nIf water is leaking, turn off your main water shut-off valve now (usually where the water line enters the basement).' : ''}`, acts: [{ label: `Call ${C.phone}`, href: TEL, icon: 'phone', hot: true }, { label: 'Send urgent request', act: 'book', arg: svc ? svc.book : '', arg2: 'Repair', icon: 'cal' }] };
    }
    if (has(t, /^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|salam|hiya)\b/) && t.trim().split(/\s+/).length <= 4)
      return { html: `Hello! What can I help you with — a repair, a new installation, maintenance, or checking if we serve your area?`, chips: ['Book a service', 'Do you serve my area?', 'Furnace repair', 'AC installation'] };
    if (has(t, /thank|thanks|thx|appreciate/)) return { html: `You're welcome! Anything else I can help with?` };

    const words = t.trim().split(/\s+/), short = words.length <= 4;
    const SVC_CHIPS = ['Heating', 'Cooling', 'Heat pump', 'Water heater', 'Plumbing', 'Electrical', 'Air & ventilation', 'Water treatment', 'Commercial', 'Not sure'];
    // "yes" / "no" answer whatever we last offered
    if (short && has(t, /^\s*(yes|yeah|yep|yup|sure|ok|okay|please|go ahead|sounds good|book it|y)\b/)) {
      if (ctx.offer) return { html: `Great — tap below to open the booking form. It only takes a minute.`, acts: [{ label: 'Open booking form', act: 'book', arg: ctx.offer.svc || '', arg2: ctx.offer.visit || '', icon: 'cal', hot: true }, { label: 'Request a call back', act: 'callback' }] };
      return { html: `Sure — what do you need help with?`, chips: SVC_CHIPS, awaiting: 'service' };
    }
    if (short && has(t, /^\s*(no|nope|nah|not now|no thanks|that's all|thats all)\b/))
      return { html: `No problem. If anything comes up, I'm here — or call us 24/7 at ${C.phone}.`, chips: ['Book a service', 'Do you serve my area?', 'Talk to a person'], offer: null };
    if (short && has(t, /^\s*(help|menu|options|what can you do|start|start over)\b/))
      return { html: `I can help you choose a service, check whether we serve your area, answer common questions, or book a visit. What would you like to do?`, chips: ['Book a service', 'Do you serve my area?', 'I have an emergency', 'Are estimates free?'] };
    if (ctx.awaiting === 'service' && has(t, /^\s*(not sure|unsure|don'?t know|idk|other)\b/))
      return { html: `No problem — book a visit and describe what's happening. Our team will figure out the right service and confirm with you.`, acts: [{ label: 'Book a visit', act: 'book', arg: 'Not sure', arg2: ctx.visit || '', icon: 'cal', hot: true }, { label: 'Request a call back', act: 'callback' }], offer: { svc: 'Not sure', visit: ctx.visit } };

    const svc = detectService(t);
    const visitHint = ctx.visit === 'New installation' ? ' install' : ctx.visit === 'Repair' ? ' repair' : ctx.visit && ctx.visit.startsWith('Maint') ? ' maintenance' : '';
    const sub = svc && pickSub(svc, VISIT_HINT_OK(t) ? t : t + visitHint);
    const brand = KB.brands.find(b => t.includes(b.n.toLowerCase().replace('.', '')) || t.includes(b.n.toLowerCase()));
    const city = cities.find(x => new RegExp(`\\b${x.c.toLowerCase().replace('.', '\\.')}\\b`).test(t));
    const postal = raw.match(/\b[a-z]\d[a-z]\s?\d[a-z]\d\b/i);

    if (has(t, /\bprice|\bcost|how much|\bcharge|\bfees?\b|\brates?\b|expensive|\bcheap|\$/))
      return { html: `Pricing depends on your home, equipment and the work involved, so we don't quote online. **Estimates for installations and replacements are free** — we'll explain your options and pricing before any work starts.`, acts: [{ label: 'Book a free estimate', act: 'book', arg: svc ? svc.book : '', arg2: 'Free estimate', icon: 'cal', hot: true }, { label: 'Request a call back', act: 'callback' }] };
    if (city) return { html: `Yes — **${city.c}** is in our service area (${city.r}). Would you like to book a visit there?`, acts: [{ label: 'Book in ' + city.c, act: 'book', arg: svc ? svc.book : (ctx.offer && ctx.offer.svc) || '', arg2: ctx.visit || '', icon: 'cal', hot: true }, { label: 'All service areas', href: 'service-areas.html' }], offer: { svc: svc ? svc.book : (ctx.offer && ctx.offer.svc) || '', visit: ctx.visit }, chips: ['Yes, book it', 'Are estimates free?'] };
    if (postal) return { html: `Thanks — we serve Brampton, the GTA and communities across Ontario. Our team will confirm availability for **${esc(postal[0].toUpperCase())}** when you book or call.`, acts: [{ label: 'Book a visit', act: 'book', icon: 'cal', hot: true }, { label: `Call ${C.phone}`, href: TEL, icon: 'phone' }] };
    const VISIT_RE = /\b(repair|repairs|fix|fixed|broken|not working|stopped working|install|installation|installed|new|replace|replacement|upgrade|maintenance|maintain|tune[- ]?up|service|servicing|check[- ]?up|inspection|estimate|quote)\b/;
    if (!svc && short && VISIT_RE.test(t) && !/book|appointment|schedule/.test(t)) {
      const visit = visitOf(t);
      const verb = visit === 'Repair' ? 'needs repairing' : visit === 'New installation' ? 'would you like installed or replaced' : visit === 'Free estimate' ? 'is the estimate for' : 'needs maintenance';
      return { html: `Sure — which system ${verb}?`, chips: SVC_CHIPS, visit, awaiting: 'service' };
    }

    if (svc) {
      // visit type: what they said, else what they told us earlier, else what the chosen job implies
      const subVisit = sub && (/repair|troubleshoot|leak|drain|clog/i.test(sub.t) ? 'Repair' : /maint|tune|flush|inspection/i.test(sub.t) ? 'Maintenance / tune-up' : /rebate/i.test(sub.t) ? 'Free estimate' : 'New installation');
      const visit = VISIT_RE.test(t) ? visitOf(t) : (ctx.visit || subVisit || visitOf(t));
      const offer = { svc: svc.book, visit };
      if (sub) return { html: `**${sub.t}** — ${sub.d}\n\nIncludes: ${sub.inc.slice(0, 4).join(', ').toLowerCase()}.\n\nWould you like to book this?`, acts: [{ label: 'Book this', act: 'book', arg: svc.book, arg2: visit, icon: 'cal', hot: true }, { label: 'Full details', href: sub.url }], offer, visit: null, chips: ['Yes, book it', 'Do you serve my area?', 'Are estimates free?'] };
      return { html: `**${svc.title}** — ${svc.lede}\n\nPopular: ${svc.subs.slice(0, 4).map(s => s.t).join(' · ')}\n\nWould you like to book a visit?`, acts: [{ label: `Book ${svc.name.toLowerCase()}`, act: 'book', arg: svc.book, arg2: visit, icon: 'cal', hot: true }, { label: 'See all details', href: svc.url }], offer, visit: null, chips: ['Yes, book it', 'Do you serve my area?', 'Are estimates free?'] };
    }
    if (has(t, /\bserve[sd]?\b|service area|\bareas?\b|come to|\bcover|location|located|where are you|do you go|travel/))
      return { html: `We're based in Brampton and serve the GTA and communities across Ontario, including ${KB.areas.map(a => a.r).slice(0, 6).join(', ')} and more. Tell me your city and I'll check.`, acts: [{ label: 'See all areas', href: 'service-areas.html' }], chips: ['Brampton', 'Mississauga', 'Toronto', 'Hamilton', 'Barrie'] };
    if (brand) return { html: `Yes, we work with **${brand.n}** (${brand.k.toLowerCase()}) — installation, repair and maintenance. We also service most other makes and models.`, acts: [{ label: 'Book a service', act: 'book', arg: svc ? svc.book : '', icon: 'cal', hot: true }] };
    if (has(t, /brand|make|model|manufacturer/)) return { html: `We install and service ${KB.brands.map(b => b.n).join(', ')} — and most other makes and models. Mention yours when you book.` };
    if (has(t, /licen|insur|certif|qualified|legit/)) return { html: `Yes — ZH Climate Solutions Inc. is **licensed and insured**, and our technicians are trained for the work they do.` };
    if (has(t, /hour|open|weekend|saturday|sunday|night|holiday|24\/?7|available/)) return { html: `Emergency service is available **24/7**. For regular appointments, book online any time and our team will contact you to confirm a time.`, acts: [{ label: 'Book online', act: 'book', icon: 'cal', hot: true }, { label: `Call ${C.phone}`, href: TEL, icon: 'phone' }] };
    if (has(t, /phone|number|email|contact|reach|talk to|human|person|someone/)) return { html: `You can reach our team at **${C.phone}** (24/7 for emergencies) or ${C.email}. Prefer we call you?`, acts: [{ label: `Call ${C.phone}`, href: TEL, icon: 'phone', hot: true }, { label: 'Request a call back', act: 'callback' }] };

    if (has(t, /book|appointment|schedule|visit|technician|come out|someone over|estimate|quote|consult/))
      return { html: `Happy to help you book. Which service do you need?`, chips: SVC_CHIPS, awaiting: 'service', acts: [{ label: 'Open booking form', act: 'book', icon: 'cal', hot: true }, { label: 'Request a call back', act: 'callback' }] };

    // FAQ match
    const fw = t.split(/\W+/).filter(w => w.length > 3);
    let bestF = null, sc = 0;
    for (const f of [...KB.faqs, ...KB.services.flatMap(s => s.faqs)]) { const q = f.q.toLowerCase(); const x = fw.filter(w => q.includes(w)).length; if (x > sc) { sc = x; bestF = f; } }
    if (bestF && sc >= 2) return { html: `${bestF.a}` };

    if (ctx.awaiting === 'service') return { html: `Sorry, I didn't catch which system. Pick one below, or choose "Not sure" and our team will help.`, chips: SVC_CHIPS, awaiting: 'service' };
    return { html: `I'm not sure I understood that. I can help with heating, cooling, heat pumps, water heaters, plumbing, electrical, ventilation and commercial services — or put you in touch with our team.`, chips: ['Book a service', 'Do you serve my area?', 'I have an emergency', 'Talk to a person'] };
  }

  function remember(r) {
    if ('visit' in r) ctx.visit = r.visit;
    ctx.awaiting = r.awaiting || null;
    if ('offer' in r) ctx.offer = r.offer;
  }
  function renderLocal(r) {
    remember(r);
    bubble(linkify(r.html).replace(/&lt;b&gt;|&lt;\/b&gt;/g, '') + (r.acts ? actions(r.acts) : ''), 'bot', r.warn ? 'msg--warn' : '');
    if (r.chips) setChips(r.chips);
    history.push({ role: 'assistant', content: r.html.replace(/\*\*/g, '') });
  }

  /* ---------- AI mode (optional) ---------- */
  async function askAI() {
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 20000);
    try {
      const r = await fetch(CFG.aiEndpoint || '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12), page: document.title }), signal: ctl.signal });
      if (!r.ok) { if ([404, 405, 501, 503].includes(r.status)) aiOff = true; return null; }
      const j = await r.json(); return j && j.reply ? j : null;
    } catch { return null; } finally { clearTimeout(to); }
  }

  async function send(text) {
    text = String(text || '').trim(); if (!text || busy) return;
    bubble(esc(text), 'me'); input.value = ''; history.push({ role: 'user', content: text.slice(0, 500) });
    busy = true; const typing = bubble('<span class="typing"><i></i><i></i><i></i></span>'); typing.style.padding = '0';
    const quick = local(text);
    let ai = null;
    if (!aiOff && !quick.warn) ai = await askAI();
    else await new Promise(r => setTimeout(r, 450));
    typing.remove(); busy = false;
    if (ai) {
      modeEl.textContent = 'AI assistant · can make mistakes';
      const svc = ai.service && KB.services.find(s => s.book === ai.service || s.slug === ai.service);
      const acts = []; if (ai.book || svc) acts.push({ label: svc ? `Book ${svc.name.toLowerCase()}` : 'Book a visit', act: 'book', arg: svc ? svc.book : '', icon: 'cal', hot: true });
      if (ai.call) acts.push({ label: `Call ${C.phone}`, href: TEL, icon: 'phone' });
      bubble(linkify(ai.reply) + (acts.length ? actions(acts) : ''));
      history.push({ role: 'assistant', content: ai.reply });
    } else renderLocal(quick);
    save();
  }
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });

  // restore this visit's conversation when moving between pages
  try {
    const h = sessionStorage.getItem('zh-chat');
    if (h) {
      log.innerHTML = h; log.querySelectorAll('a[data-href]').forEach(a => a.setAttribute('href', ROOT + a.dataset.href));
      history = JSON.parse(sessionStorage.getItem('zh-chat-h') || '[]'); ctx = { ...ctx, ...JSON.parse(sessionStorage.getItem('zh-chat-c') || '{}') };
      chips.innerHTML = sessionStorage.getItem('zh-chat-chips') || '';
      log.scrollTop = log.scrollHeight;
    }
  } catch {}
})();
