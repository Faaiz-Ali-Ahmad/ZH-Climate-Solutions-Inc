/* ZH Climate Solutions — site behaviour */
(() => {
  const CFG = window.ZH_CONFIG || {};
  if (CFG.formEndpoint && !/^https:\/\//.test(CFG.formEndpoint)) CFG.formEndpoint = '';   // never post personal data over plain http
  const escH = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  $$('.yr').forEach(e => e.textContent = new Date().getFullYear());

  /* ---------- header ---------- */
  const header = $('.header');
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const dd = $('.dd'), ddBtn = dd && $('.dd__btn', dd);
  if (dd) {
    const set = o => { dd.classList.toggle('open', o); ddBtn.setAttribute('aria-expanded', o); };
    ddBtn.addEventListener('click', e => { e.stopPropagation(); set(!dd.classList.contains('open')); });
    if (matchMedia('(hover:hover)').matches) { let t; dd.addEventListener('mouseenter', () => { clearTimeout(t); set(true); }); dd.addEventListener('mouseleave', () => { t = setTimeout(() => set(false), 180); }); }
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }
  // two-level services menu: hovering/focusing a service shows its sub-pages
  $$('.mega__tab').forEach(tab => {
    const show = () => { $$('.mega__tab').forEach(t => t.classList.toggle('on', t === tab)); $$('.mega__panel').forEach(p => p.classList.toggle('on', p.dataset.panel === tab.dataset.panel)); };
    tab.addEventListener('mouseenter', show); tab.addEventListener('focus', show);
  });
  const burger = $('.burger'), mmenu = $('#mmenu');
  if (burger) burger.addEventListener('click', () => { const o = mmenu.hidden; mmenu.hidden = !o; burger.setAttribute('aria-expanded', o); });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else $$('.reveal').forEach(el => el.classList.add('in'));

  /* ---------- booking widget ---------- */
  const params = new URLSearchParams(location.search);
  const forms = $$('form.booking');
  const mainForm = $('#book');
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const nice = d => `${DAYS[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;

  forms.forEach(form => {
    const steps = $$('.bstep', form), dots = $$('.booking__steps li', form), bar = $('.booking__bar i', form);
    const prev = $('[data-prev]', form), next = $('[data-next]', form), submit = $('[data-submit]', form), status = $('.booking__status', form);
    let cur = 0;

    // day picker (today + next 7 days)
    const days = $('.days', form), now = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      days.insertAdjacentHTML('beforeend', `<label class="day"><input type="radio" name="day" value="${iso(d)}" data-label="${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : nice(d)}"><span><small>${i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DAYS[d.getDay()]}</small><b>${d.getDate()}</b><em>${MON[d.getMonth()]}</em></span></label>`);
    }
    const dateIn = form.elements.date; dateIn.min = iso(now);
    dateIn.addEventListener('change', () => { if (dateIn.value) $$('input[name=day]', form).forEach(r => r.checked = false); });
    days.addEventListener('change', () => { dateIn.value = ''; });
    // preselect
    const pre = params.get('service') || form.dataset.preselect;
    if (pre) setRadio(form, 'service', pre);
    if (params.get('city')) form.elements.city.value = params.get('city');
    if (params.get('property')) form.elements.property.value = params.get('property');
    // urgent
    const urg = form.elements.urgent, note = $('.urgent-note', form);
    urg.addEventListener('change', () => note.hidden = !urg.checked);

    function show(i) {
      cur = i;
      steps.forEach((s, j) => s.classList.toggle('on', j === i));
      dots.forEach((d, j) => { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i); });
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      prev.hidden = i === 0; next.hidden = i === steps.length - 1; submit.hidden = i !== steps.length - 1;
      status.textContent = '';
    }
    function valid(i) {
      const s = steps[i]; let ok = true, msg = '';
      if (i === 0 && !form.elements.service.value) { ok = false; msg = 'Please choose a service.'; }
      if (i === 1 && !form.elements.day.value && !dateIn.value) { ok = false; msg = 'Please pick a preferred day.'; }
      if (i === 2) {
        $$('[required]', s).forEach(el => {
          const bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || !el.checkValidity() || (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10);
          el.closest('.field,.consent').classList.toggle('err', bad);
          if (bad && ok) { ok = false; el.focus(); }
        });
        if (!ok) msg = 'Please complete the highlighted fields.';
      }
      status.textContent = msg; return ok;
    }
    $$('[required]', form).forEach(el => el.addEventListener('input', () => el.closest('.field,.consent')?.classList.remove('err')));
    next.addEventListener('click', () => { if (valid(cur)) { show(cur + 1); scrollIntoViewIfNeeded(form); } });
    prev.addEventListener('click', () => show(cur - 1));
    form.elements.service.forEach?.(r => r.addEventListener('change', () => { if (cur === 0) status.textContent = ''; }));
    show(0);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!valid(2)) return;
      const f = form.elements; if (f._gotcha.value) return;
      const dayR = $('input[name=day]:checked', form);
      const when = dayR ? dayR.dataset.label + (dayR.dataset.label.length < 10 ? ` (${nice(new Date(dayR.value + 'T12:00'))})` : '') : nice(new Date(dateIn.value + 'T12:00'));
      const d = {
        service: f.service.value, visit: f.visit.value, urgent: f.urgent.checked ? 'YES — urgent' : 'No',
        date: when, window: f.window.value, name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(),
        property: f.property.value, address: f.address.value.trim(), city: f.city.value.trim(), postal: f.postal.value.trim().toUpperCase(), message: f.message.value.trim()
      };
      const subject = `${d.urgent.startsWith('YES') ? 'URGENT — ' : ''}Booking request: ${d.service} (${d.visit}) — ${d.city}`;
      const body = [
        `Service: ${d.service}`, `Visit type: ${d.visit}`, `Urgent: ${d.urgent}`, `Preferred day: ${d.date}`, `Arrival window: ${d.window}`, '',
        `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email}`, `Property: ${d.property}`,
        `Address: ${[d.address, d.city, d.postal].filter(Boolean).join(', ')}`, '', 'Details:', d.message || '(none)'
      ].join('\n');
      const btn = submit;
      if (CFG.formEndpoint) {
        btn.disabled = true; status.style.color = 'var(--mute)'; status.textContent = 'Sending your request…';
        try {
          const payload = { ...d, subject, _subject: subject, message: body, from_name: 'ZH Climate website', _replyto: d.email };
          if (CFG.web3formsKey) payload.access_key = CFG.web3formsKey;
          const r = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
          if (!r.ok) throw new Error(r.status);
          done(form, d, false);
        } catch {
          btn.disabled = false; status.style.color = '';
          status.innerHTML = `We couldn't send that just now. Please call <a href="tel:+16476144019">${CFG.phone}</a> or email <a href="mailto:${CFG.email}">${CFG.email}</a>.`;
        }
      } else {
        const href = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        done(form, d, true, href, body);
        location.href = href;
      }
    });
  });

  function done(form, d, viaMail, href, body) {
    const e = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    form.innerHTML = `<div class="done">
      <div class="done__tick"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
      <h3>${viaMail ? 'Almost done' : 'Request received'}, ${e(d.name.split(' ')[0])}!</h3>
      <p>${viaMail ? 'Your email app has opened with your booking filled in — just press <b>Send</b>.' : 'Thanks for booking with ZH Climate Solutions.'}</p>
      <dl class="done__sum"><div><dt>Service</dt><dd>${e(d.service)} · ${e(d.visit)}</dd></div><div><dt>Preferred</dt><dd>${e(d.date)}</dd></div><div><dt>Window</dt><dd>${e(d.window)}</dd></div><div><dt>Location</dt><dd>${e(d.city)}</dd></div></dl>
      <ul class="done__next"><li>${tick()} We'll contact you at <b>${e(d.phone)}</b> to confirm your appointment.</li><li>${tick()} Need help sooner? Call <a href="tel:+16476144019">${CFG.phone}</a> — 24/7.</li></ul>
      <div class="done__btns">${viaMail ? `<a class="btn btn--hot" href="${href}">Open email again</a><button type="button" class="btn btn--line" data-copy>Copy request</button>` : ''}<a class="btn btn--navy" href="tel:+16476144019">Call ${CFG.phone}</a></div>
    </div>`;
    const c = $('[data-copy]', form); if (c) c.addEventListener('click', async () => { try { await navigator.clipboard.writeText(body); c.textContent = 'Copied ✓'; } catch { c.textContent = 'Copy failed'; } });
    scrollIntoViewIfNeeded(form);
  }
  const tick = () => '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  function setRadio(form, name, val) { const r = $$(`input[name="${name}"]`, form).find(x => x.value.toLowerCase() === String(val).toLowerCase()); if (r) r.checked = true; return r; }
  function scrollIntoViewIfNeeded(el) { const r = el.getBoundingClientRect(); if (r.top < 90 || r.top > innerHeight * .6) scrollTo({ top: scrollY + r.top - 100, behavior: reduce ? 'auto' : 'smooth' }); }

  // Any "Book" link scrolls to the on-page booking form (or goes to book.html)
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-book],[data-visit],a[href="#book"]'); if (!a || !mainForm || !mainForm.elements) return;
    e.preventDefault();
    if (mmenu && !mmenu.hidden) { mmenu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
    const svc = a.dataset.service || new URL(a.href, location.href).searchParams.get('service');
    if (svc && mainForm.elements.service) setRadio(mainForm, 'service', svc);
    const city = a.dataset.city; if (city && mainForm.elements.city) mainForm.elements.city.value = city;
    if (a.dataset.visit && mainForm.elements.visit) setRadio(mainForm, 'visit', a.dataset.visit);
    const prop = new URL(a.href, location.href).searchParams.get('property'); if (prop && mainForm.elements.property) mainForm.elements.property.value = prop;
    scrollTo({ top: scrollY + mainForm.getBoundingClientRect().top - 100, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => (mainForm.querySelector('input:checked') || mainForm.querySelector('input'))?.focus({ preventScroll: true }), 500);
  });

  /* ---------- brands strip: auto-scroll + drag/swipe with momentum ---------- */
  $$('.brandstrip__band').forEach(band => {
    const tracks = $$('.brandstrip__track', band);
    const AUTO = reduce ? 0 : -45;           // px per second (leftward)
    let x = 0, vel = AUTO, dragging = false, lastX = 0, lastT = 0, visible = true, hover = false, prev = performance.now();
    const width = () => tracks[0].getBoundingClientRect().width;
    const wrapX = () => { const w = width(); if (!w) return; x = ((x % w) + w) % w - w; };
    const paint = () => { tracks.forEach(t => t.style.transform = `translate3d(${x}px,0,0)`); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(band);
    band.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
    band.addEventListener('pointerleave', () => hover = false);
    band.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0;
      band.setPointerCapture(e.pointerId); band.classList.add('dragging');
    });
    band.addEventListener('pointermove', e => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
      x += dx; vel = dx / dt * 1000; lastX = e.clientX; lastT = now; wrapX(); paint();
    });
    const end = () => { if (!dragging) return; dragging = false; band.classList.remove('dragging'); vel = Math.max(-2400, Math.min(2400, vel)); };
    band.addEventListener('pointerup', end); band.addEventListener('pointercancel', end);
    band.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { x += 160; wrapX(); paint(); } if (e.key === 'ArrowRight') { x -= 160; wrapX(); paint(); } });
    (function loop(now) {
      const dt = Math.min(.1, (now - prev) / 1000); prev = now;
      if (!dragging && visible && !document.hidden) {
        const target = hover ? AUTO * .25 : AUTO;
        vel += (target - vel) * Math.min(1, dt * 2.2);   // ease back to auto speed after a flick
        x += vel * dt; wrapX(); paint();
      }
      requestAnimationFrame(loop);
    })(prev);
    addEventListener('resize', () => { wrapX(); paint(); });
  });

  /* ---------- floating consultation panel ---------- */
  const consult = $('.consult');
  if (consult) {
    const tab = $('.consult__tab', consult), panel = $('.consult__panel', consult), cform = $('.consult__form', consult);
    const open = o => { panel.hidden = !o; tab.setAttribute('aria-expanded', o); tab.style.visibility = o ? 'hidden' : ''; if (o) setTimeout(() => $('select,input', panel)?.focus(), 50); else tab.focus({ preventScroll: true }); };
    tab.addEventListener('click', () => open(true));
    $('.consult__x', consult).addEventListener('click', () => open(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) open(false); });
    document.addEventListener('click', e => { if (!panel.hidden && !consult.contains(e.target)) open(false); });
    $$('a[data-book]', panel).forEach(a => a.addEventListener('click', () => open(false)));
    window.ZH_openConsult = () => open(true);
    // pre-fill the service from the page you're on
    const pre = mainForm && mainForm.dataset.preselect; if (pre) { const o = [...cform.service.options].find(x => x.value === pre); if (o) cform.service.value = pre; }
    $$('[required]', cform).forEach(el => el.addEventListener('input', () => el.closest('.field,.consent')?.classList.remove('err')));
    cform.addEventListener('submit', async e => {
      e.preventDefault();
      const st = $('.consult__status', cform); let ok = true;
      $$('[required]', cform).forEach(el => { const bad = el.type === 'checkbox' ? !el.checked : !el.value.trim() || !el.checkValidity() || (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10); el.closest('.field,.consent').classList.toggle('err', bad); if (bad && ok) { ok = false; el.focus(); } });
      if (!ok) { st.textContent = 'Please complete the highlighted fields.'; return; }
      if (cform._gotcha.value) return;
      const f = cform.elements, d = { reason: f.reason.value, service: f.service.value, name: f.name.value.trim(), phone: f.phone.value.trim(), city: f.city.value.trim() };
      const subject = `Call-back request: ${d.service} — ${d.reason.toLowerCase()} (${d.city})`;
      const body = [`Call-back request from the website`, '', `Needs: ${d.reason}`, `Service: ${d.service}`, `Name: ${d.name}`, `Phone: ${d.phone}`, `City / postal code: ${d.city}`, '', `Page: ${document.title}`].join('\n');
      const thanks = (viaMail, href) => { cform.outerHTML = `<div class="consult__done"><div class="done__tick">${tick()}</div><h3>${viaMail ? 'Almost done' : 'Thanks'}, ${escH(d.name.split(' ')[0])}</h3><p>${viaMail ? 'Your email app has opened with the request — just press <b>Send</b>.' : `We'll call you at <b>${escH(d.phone)}</b> to arrange your consultation.`}</p>${viaMail ? `<p style="margin-top:10px"><a class="btn btn--line btn--sm" href="${href}">Open email again</a></p>` : ''}</div>`; };
      if (CFG.formEndpoint) {
        st.style.color = 'var(--mute)'; st.textContent = 'Sending…';
        try {
          const payload = { ...d, subject, _subject: subject, message: body, from_name: 'ZH Climate website' };
          if (CFG.web3formsKey) payload.access_key = CFG.web3formsKey;
          const r = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
          if (!r.ok) throw 0; thanks(false);
        } catch { st.style.color = ''; st.innerHTML = `Couldn't send just now — please call <a href="tel:+16476144019">${CFG.phone}</a>.`; }
      } else {
        const href = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        thanks(true, href); location.href = href;
      }
    });
  }

  // helpers used by the chat assistant
  window.ZH_book = (svc, visit) => {
    if (mainForm && mainForm.elements) {
      if (svc) setRadio(mainForm, 'service', svc);
      if (visit) setRadio(mainForm, 'visit', visit);
      scrollTo({ top: scrollY + mainForm.getBoundingClientRect().top - 100, behavior: reduce ? 'auto' : 'smooth' });
      return true;
    }
    location.href = 'book.html' + (svc ? '?service=' + encodeURIComponent(svc) : ''); return false;
  };

  /* ---------- service area search ---------- */
  $$('.areas').forEach(box => {
    const q = $('input[type=search]', box), none = $('.areas__none', box);
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase(); let any = false;
      $$('.areas__region', box).forEach(reg => {
        let hit = false;
        $$('li', reg).forEach(li => { const m = !v || li.textContent.toLowerCase().includes(v) || $('h3', reg).textContent.toLowerCase().includes(v); li.hidden = !m; hit ||= m; });
        reg.hidden = !hit; any ||= hit;
      });
      none.hidden = any;
    });
  });

  /* ---------- seasonal checklist ---------- */
  const range = $('#pRange');
  if (range) {
    const pT = $('#pTemp'), pS = $('#pSeason'), pL = $('#pList'), pC = $('#pCta'), sec = $('#seasons');
    const bands = [
      { max: -10, name: 'Deep winter', col: '#0d5bd7', bg: 'rgba(58,160,255,.22)', svc: 'Heating', cta: 'Book a furnace check', items: ['Furnace running constantly? Get it inspected', 'Protect pipes in unheated areas from freezing', 'Replace the furnace filter', 'Test carbon monoxide and smoke alarms'] },
      { max: 2, name: 'Early winter', col: '#1f7be6', bg: 'rgba(58,160,255,.16)', svc: 'Heating', cta: 'Book a heating tune-up', items: ['Furnace or heat pump tune-up', 'Check humidity — add a humidifier if air is dry', 'Insulate exposed plumbing', 'Inspect outdoor outlets and lighting'] },
      { max: 14, name: 'Shoulder season', col: '#475a7a', bg: 'rgba(160,180,210,.22)', svc: 'Not sure', cta: 'Plan seasonal maintenance', items: ['Best time to plan an upgrade or replacement', 'Flush the water heater', 'Electrical panel and outlet safety check', 'Clean vents and check ductwork'] },
      { max: 24, name: 'Early summer', col: '#d96a00', bg: 'rgba(255,176,32,.18)', svc: 'Cooling', cta: 'Book an AC tune-up', items: ['AC tune-up before the first heatwave', 'Clear debris around the outdoor unit', 'Check the condensate drain', 'Consider a dehumidifier for the basement'] },
      { max: 99, name: 'Heatwave', col: '#e65100', bg: 'rgba(255,122,0,.2)', svc: 'Cooling', cta: 'Get cooling help', items: ['AC not keeping up? Book a repair', 'Ask about a ductless mini-split for hot rooms', 'Avoid overloading circuits with portable units', 'Watch for leaks around the indoor coil'] }
    ];
    let last;
    const upd = () => {
      const v = +range.value, b = bands.find(x => v <= x.max);
      pT.textContent = (v > 0 ? '+' : '') + v;
      if (window.ZH) window.ZH.temp = Math.max(-.8, Math.min(.8, (v - 5) / 25));
      if (b === last) return; last = b;
      pS.textContent = b.name; sec.style.setProperty('--sa', b.col); sec.style.setProperty('--sc', b.bg);
      pL.innerHTML = b.items.map((t, i) => `<div style="animation-delay:${i * 50}ms">${t}</div>`).join('');
      pC.dataset.service = b.svc; pC.childNodes[0].textContent = b.cta + ' ';
    };
    range.addEventListener('input', upd); upd();
  }
})();
