// Static site generator: node build/build.mjs  → writes *.html in the site root
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { company as C, trust, services, bookServices, areas, generalFaqs, brands } from './data.mjs';
import { icon } from './icons.mjs';
import { sub } from './subpages.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const allCities = areas.flatMap(([, c]) => c);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const year = new Date().getFullYear();
const slugify = t => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const subFile = (s, o) => `${s.slug}-${slugify(o.t)}.html`;
const visitFor = t => /install|replace|new |upgrade|add/i.test(t) ? 'New installation' : /maint|tune|flush|inspection/i.test(t) ? 'Maintenance / tune-up' : /rebate/i.test(t) ? 'Free estimate' : 'Repair';

/* ---------------- partials ---------------- */
const head = ({ title, desc, page, extraHead = '' }) => `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0a1f44">
<link rel="canonical" href="${C.site}/${page === 'index' ? '' : page + '.html'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="img/brand-mark.webp">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="style.css">
<script>document.documentElement.classList.add('js')</script>
${extraHead}
</head>`;

const logo = `<a href="index.html" class="brand" aria-label="${C.name} — home">
  <span class="brand__mark">ZH<i>${icon('bolt')}</i></span>
  <span class="brand__txt"><b>ZH CLIMATE</b><small>SOLUTIONS INC.</small></span>
</a>`;

const header = active => `<a class="skip" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap topbar__in">
    <span class="topbar__item">${icon('clock')} 24/7 emergency service</span>
    <span class="topbar__item hide-sm">${icon('shield')} Licensed &amp; insured</span>
    <span class="topbar__item hide-sm">${icon('tag')} Free estimates</span>
    <span class="topbar__item hide-sm">${icon('pin')} Brampton, the GTA &amp; Ontario</span>
    <a class="topbar__call" href="tel:${C.tel}">${icon('phone')} ${C.phone}</a>
  </div>
</div>
<header class="header">
  <div class="wrap header__in">
    ${logo}
    <nav class="mainnav" aria-label="Primary">
      <div class="dd">
        <button class="mainnav__link dd__btn ${['services', ...services.map(s => s.slug)].includes(active) ? 'is-active' : ''}" aria-expanded="false" aria-controls="mega">Services ${icon('chev')}</button>
        <div class="mega" id="mega">
          <div class="mega__tabs">
            ${services.map((s, i) => `<a href="${s.slug}.html" class="mega__tab tone-${s.tone} ${i === 0 ? 'on' : ''}" data-panel="${s.slug}"><span class="mega__ic">${icon(s.icon)}</span><b>${s.nav}</b>${icon('chev', 'mega__chev')}</a>`).join('')}
          </div>
          <div class="mega__panels">
            ${services.map((s, i) => `<div class="mega__panel ${i === 0 ? 'on' : ''}" data-panel="${s.slug}">
              <p class="mega__ptitle">${s.title}</p><p class="mega__plede">${esc(s.lede)}</p>
              <ul>${s.offerings.map(o => `<li><a href="${subFile(s, o)}">${esc(o.t)}</a></li>`).join('')}</ul>
              <a class="link" href="${s.slug}.html">All ${s.name.toLowerCase()} services ${icon('arrow')}</a>
            </div>`).join('')}
          </div>
          <div class="mega__aside">
            <p class="eyebrow">Need help now?</p>
            <p class="mega__big">24/7 emergency service</p>
            <a class="btn btn--hot btn--sm" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a>
            <a class="btn btn--line btn--sm" href="book.html">Book online</a>
          </div>
        </div>
      </div>
      <a class="mainnav__link ${active === 'commercial' ? 'is-active' : ''}" href="commercial.html">Commercial</a>
      <a class="mainnav__link ${active === 'maintenance-plans' ? 'is-active' : ''}" href="maintenance-plans.html">Maintenance</a>
      <a class="mainnav__link ${active === 'service-areas' ? 'is-active' : ''}" href="service-areas.html">Service Areas</a>
      <a class="mainnav__link" href="index.html#faq">FAQ</a>
    </nav>
    <div class="header__cta">
      <a class="header__phone" href="tel:${C.tel}"><span class="dot"></span><span><small>Call 24/7</small><b>${C.phone}</b></span></a>
      <a class="btn btn--hot" href="book.html" data-book>${icon('cal')} Book now</a>
    </div>
    <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mmenu"><i></i><i></i><i></i></button>
  </div>
  <div class="mmenu" id="mmenu" hidden>
    <div class="mmenu__group"><p class="eyebrow">Services</p>${services.map(s => `<details class="mmenu__svc"><summary>${icon(s.icon)} ${s.nav}${icon('chev', 'mmenu__chev')}</summary><div class="mmenu__subs"><a href="${s.slug}.html"><b>Overview</b></a>${s.offerings.map(o => `<a href="${subFile(s, o)}">${esc(o.t)}</a>`).join('')}</div></details>`).join('')}</div>
    <div class="mmenu__group"><a href="service-areas.html">${icon('pin')} Service Areas</a><a href="index.html#faq">${icon('help')} FAQ</a></div>
    <a class="btn btn--hot btn--full" href="book.html">${icon('cal')} Book an appointment</a>
    <a class="btn btn--navy btn--full" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a>
  </div>
</header>`;

const booking = ({ pre = '', id = 'book', heading = 'Book your appointment', compact = false, visit = 'Repair' } = {}) => `
<form class="booking lg ${compact ? 'booking--compact' : ''}" id="${id}" data-preselect="${esc(pre)}" novalidate>
  <div class="booking__head">
    <div><p class="eyebrow">${icon('cal')} Online booking</p><h2 class="booking__title">${heading}</h2></div>
    <ol class="booking__steps" aria-label="Booking steps"><li class="on"><b>1</b><span>Service</span></li><li><b>2</b><span>Time</span></li><li><b>3</b><span>Details</span></li></ol>
  </div>
  <div class="booking__bar"><i></i></div>

  <fieldset class="bstep" data-step="1">
    <legend class="bstep__q">What do you need help with?</legend>
    <div class="svc-grid">
      ${bookServices.map(([n, ic]) => `<label class="svc"><input type="radio" name="service" value="${n}" required><span>${icon(ic)}<b>${n}</b></span></label>`).join('')}
    </div>
    <p class="bstep__q bstep__q--sm">Type of visit</p>
    <div class="chips">
      ${['Repair', 'Maintenance / tune-up', 'New installation', 'Free estimate'].map((t, i) => `<label class="chip"><input type="radio" name="visit" value="${t}" ${t === visit ? 'checked' : ''}><span>${t}</span></label>`).join('')}
    </div>
    <label class="urgent"><input type="checkbox" name="urgent" value="yes"><span>${icon('alert')} This is urgent (no heat, major leak, electrical hazard)</span></label>
    <div class="urgent-note" hidden>${icon('phone')} <span>For emergencies, calling is fastest: <a href="tel:${C.tel}"><b>${C.phone}</b></a> — available 24/7. You can still send this request.</span></div>
  </fieldset>

  <fieldset class="bstep" data-step="2">
    <legend class="bstep__q">When works best for you?</legend>
    <div class="days" aria-label="Preferred day"></div>
    <label class="field field--date"><span>Or choose another date</span><input type="date" name="date"></label>
    <p class="bstep__q bstep__q--sm">Preferred arrival window</p>
    <div class="chips chips--win">
      ${[['Morning', '8 am – 12 pm'], ['Afternoon', '12 – 4 pm'], ['Evening', '4 – 8 pm'], ['Flexible', 'Any time']].map(([t, s], i) => `<label class="chip chip--tall"><input type="radio" name="window" value="${t} (${s})" ${i === 3 ? 'checked' : ''}><span><b>${t}</b><small>${s}</small></span></label>`).join('')}
    </div>
  </fieldset>

  <fieldset class="bstep" data-step="3">
    <legend class="bstep__q">Your details</legend>
    <div class="row2">
      <label class="field"><span>Full name *</span><input name="name" required autocomplete="name" maxlength="80"></label>
      <label class="field"><span>Phone *</span><input name="phone" type="tel" required autocomplete="tel" inputmode="tel" maxlength="20"></label>
    </div>
    <div class="row2">
      <label class="field"><span>Email *</span><input name="email" type="email" required autocomplete="email" maxlength="120"></label>
      <label class="field"><span>Property type</span><select name="property"><option>Residential</option><option>Commercial</option></select></label>
    </div>
    <label class="field"><span>Street address</span><input name="address" autocomplete="street-address" maxlength="160"></label>
    <div class="row2">
      <label class="field"><span>City *</span><input name="city" required list="cities-${id}" autocomplete="address-level2" maxlength="80"></label>
      <label class="field"><span>Postal code</span><input name="postal" autocomplete="postal-code" maxlength="7"></label>
    </div>
    <datalist id="cities-${id}">${allCities.map(c => `<option value="${c}">`).join('')}</datalist>
    <label class="field"><span>Tell us what's happening</span><textarea name="message" rows="3" maxlength="2000" placeholder="e.g. Furnace is making a loud noise and blowing cold air"></textarea></label>
    <label class="consent"><input type="checkbox" name="consent" required><span>I agree to be contacted by ZH Climate Solutions about this request. <a href="privacy.html">Privacy</a></span></label>
    <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  </fieldset>

  <div class="booking__nav">
    <button type="button" class="btn btn--line" data-prev hidden>Back</button>
    <button type="button" class="btn btn--hot" data-next>Continue ${icon('arrow')}</button>
    <button type="submit" class="btn btn--hot" data-submit hidden>${icon('check')} Request appointment</button>
  </div>
  <p class="booking__status" role="status" aria-live="polite"></p>
  <p class="booking__fine">${icon('shield')} No payment needed. We'll call or email to confirm your time.</p>
</form>
<noscript><p class="noscript">Online booking needs JavaScript. Please call <a href="tel:${C.tel}">${C.phone}</a> or email <a href="mailto:${C.email}">${C.email}</a>.</p></noscript>`;

const emergency = `<section class="emerg">
  <div class="wrap emerg__in">
    <div class="emerg__ic">${icon('alert')}</div>
    <div><h2>No heat? Burst pipe? Power out?</h2><p>Emergency heating, cooling, plumbing and electrical service — 24 hours a day, 7 days a week.</p></div>
    <a class="btn btn--hot btn--lg" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a>
  </div>
</section>`;

const process = `<section class="sec process">
  <div class="wrap">
    <div class="sec__head center"><p class="eyebrow">How it works</p><h2 class="h2">Booked in minutes. Fixed properly.</h2></div>
    <ol class="steps">
      <li class="reveal"><span class="steps__n">01</span>${icon('cal')}<h3>Book online or call</h3><p>Choose your service and a time that suits you — or call us 24/7.</p></li>
      <li class="reveal"><span class="steps__n">02</span>${icon('phone')}<h3>We confirm</h3><p>Our team contacts you to confirm the appointment and any details.</p></li>
      <li class="reveal"><span class="steps__n">03</span>${icon('wrench')}<h3>Technician visit</h3><p>A licensed, insured technician diagnoses the problem and explains your options.</p></li>
      <li class="reveal"><span class="steps__n">04</span>${icon('check')}<h3>Done right</h3><p>Work is completed, tested and cleaned up — with clear pricing upfront.</p></li>
    </ol>
  </div>
</section>`;

const faqList = list => `<div class="faq">${list.map(f => `<details><summary>${esc(f.q)}<i></i></summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;

const ctaBand = (title = 'Ready when you are.') => `<section class="ctaband">
  <div class="wrap ctaband__in">
    <div><h2>${title}</h2><p>Book online in under a minute, or speak to our team now.</p></div>
    <div class="ctaband__btns"><a class="btn btn--hot btn--lg" href="book.html" data-book>${icon('cal')} Book an appointment</a><a class="btn btn--white btn--lg" href="tel:${C.tel}">${icon('phone')} ${C.phone}</a></div>
  </div>
</section>`;

const footer = `<footer class="footer">
  <svg class="swoosh" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,90 C320,20 640,110 960,60 C1160,28 1320,44 1440,20" stroke="#0d5bd7" stroke-width="10" fill="none"/><path d="M0,104 C360,50 700,120 1020,76 C1200,50 1340,60 1440,42" stroke="#3aa0ff" stroke-width="5" fill="none"/><path d="M0,114 C380,80 760,126 1080,94 C1240,76 1360,78 1440,68" stroke="#ff7a00" stroke-width="2.5" fill="none"/></svg>
  <div class="wrap footer__grid">
    <div class="footer__brand">
      ${logo}
      <p>Heating, cooling, plumbing and electrical services for homes and businesses across Brampton, the GTA and Ontario.</p>
      <a class="footer__contact" href="tel:${C.tel}">${icon('phone')} ${C.phone}</a>
      <a class="footer__contact" href="mailto:${C.email}">${icon('mail')} ${C.email}</a>
      <span class="footer__contact">${icon('pin')} Based in ${C.base}</span>
    </div>
    <div><h3>Services</h3><ul>${services.map(s => `<li><a href="${s.slug}.html">${s.nav}</a></li>`).join('')}</ul></div>
    <div><h3>Company</h3><ul><li><a href="book.html">Book an appointment</a></li><li><a href="service-areas.html">Service areas</a></li><li><a href="commercial.html">Commercial</a></li><li><a href="maintenance-plans.html">Maintenance</a></li><li><a href="index.html#faq">FAQ</a></li><li><a href="privacy.html">Privacy</a></li></ul></div>
    <div><h3>Popular areas</h3><ul class="footer__areas">${['Brampton', 'Mississauga', 'Toronto', 'Vaughan', 'Oakville', 'Milton', 'Hamilton', 'Burlington', 'Markham', 'Kitchener'].map(c => `<li><a href="service-areas.html#${c.toLowerCase().replace(/\W+/g, '-')}">${c}</a></li>`).join('')}<li><a href="service-areas.html"><b>All areas →</b></a></li></ul></div>
  </div>
  <div class="wrap footer__bottom"><span>© <span class="yr">${year}</span> ${C.name} All rights reserved.</span><span>${C.slogan}</span></div>
</footer>
<div class="mbar"><a href="tel:${C.tel}">${icon('phone')} Call 24/7</a><a href="book.html" class="mbar__book" data-book>${icon('cal')} Book now</a></div>
<aside class="consult" aria-label="Book a free consultation">
  <button class="consult__tab" type="button" aria-expanded="false" aria-controls="consult-panel">${icon('cal')}<span>Book a free consultation</span></button>
  <div class="consult__panel" id="consult-panel" role="dialog" aria-labelledby="consult-title" hidden>
    <div class="consult__head"><div><p class="eyebrow">Free, no obligation</p><h2 id="consult-title">Book a free in-home consultation</h2></div><button class="consult__x" type="button" aria-label="Close">${icon('x')}</button></div>
    <p class="consult__lede">Leave your number and we'll call you back to arrange a time that suits you.</p>
    <ul class="consult__ticks">${trust.slice(0, 3).map(t => `<li>${icon('check')}${t.title}</li>`).join('')}</ul>
    <form class="consult__form" novalidate>
      <div class="row2">
        <label class="field"><span>I need</span><select name="reason"><option>A new installation</option><option>A replacement</option><option>A repair</option><option>Maintenance</option><option>A free estimate</option><option>Not sure yet</option></select></label>
        <label class="field"><span>For</span><select name="service">${bookServices.map(([n]) => `<option>${n}</option>`).join('')}</select></label>
      </div>
      <div class="row2">
        <label class="field"><span>Name *</span><input name="name" required autocomplete="name" maxlength="80"></label>
        <label class="field"><span>Phone *</span><input name="phone" type="tel" required autocomplete="tel" inputmode="tel" maxlength="20"></label>
      </div>
      <label class="field"><span>City or postal code *</span><input name="city" required list="consult-cities" autocomplete="address-level2" maxlength="80"></label>
      <datalist id="consult-cities">${allCities.map(c => `<option value="${c}">`).join('')}</datalist>
      <label class="consent"><input type="checkbox" name="consent" required><span>I agree to be contacted about this request. <a href="privacy.html">Privacy</a></span></label>
      <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn--hot btn--full" type="submit">${icon('phone')} Request a call back</button>
      <p class="consult__status" role="status" aria-live="polite"></p>
    </form>
    <div class="consult__alt"><a href="tel:${C.tel}">${icon('phone')} ${C.phone}</a><a href="book.html" data-book>Full booking form ${icon('arrow')}</a></div>
  </div>
</aside>
<div class="chat">
  <button class="chat__launcher" type="button" aria-expanded="false" aria-controls="chat-panel">${icon('chat')}<span>Ask ZH</span></button>
  <section class="chat__panel" id="chat-panel" role="dialog" aria-label="ZH Climate assistant" hidden>
    <header class="chat__head"><span class="chat__avatar">ZH</span><div><b>ZH Assistant</b><small class="chat__mode">Answers about services, areas and booking</small></div><button class="chat__x" type="button" aria-label="Close chat">${icon('x')}</button></header>
    <div class="chat__log" role="log" aria-live="polite"></div>
    <div class="chat__chips"></div>
    <form class="chat__form"><label class="vh" for="chat-input">Message</label><input id="chat-input" autocomplete="off" maxlength="500" placeholder="Ask about a service, area or booking"><button type="submit" aria-label="Send">${icon('send')}</button></form>
    <p class="chat__fine">Automated assistant — it can make mistakes. Emergencies: call <a href="tel:${C.tel}">${C.phone}</a></p>
  </section>
</div>`;

const scripts = (extra = '') => `<script src="config.js"></script>
<script src="js/main.js"></script>
<script src="js/kb.js"></script>
<script src="js/chat.js"></script>${extra}
</body>
</html>`;

const localBusiness = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'HVACBusiness', name: C.name, telephone: '+1-647-614-4019', email: C.email, url: C.site, slogan: C.slogan,
  address: { '@type': 'PostalAddress', addressLocality: 'Brampton', addressRegion: 'ON', addressCountry: 'CA' },
  areaServed: allCities.map(c => ({ '@type': 'City', name: c + ', ON' })),
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title } })) }
})}</script>`;

const write = (file, html) => { writeFileSync(path.join(root, file), html); console.log('  ✓', file); };

const brandItems = brands.map(([n, k]) => `<li class="bs-item"><b>${n}</b><small>${k}</small></li><li class="bs-sep" aria-hidden="true"></li>`).join('');
const brandsBlock = `<section class="brandstrip" id="brands" aria-labelledby="brands-title">
  <div class="wrap brandstrip__head"><h2 id="brands-title">Brands we install and service</h2><p>Plus most other makes and models. Mention yours when you book.</p></div>
  <div class="brandstrip__stage">
    <div class="brandstrip__back" aria-hidden="true"></div>
    <div class="brandstrip__band" tabindex="0" aria-label="Brands we work with. Drag or swipe to scroll.">
      <ul class="brandstrip__track">${brandItems}</ul><ul class="brandstrip__track" aria-hidden="true">${brandItems}</ul>
    </div>
  </div>
</section>`;

/* ---------------- HOME ---------------- */
const serviceCard = s => `<article class="scard tone-${s.tone} reveal">
  <div class="scard__ic">${icon(s.icon)}</div>
  <h3><a href="${s.slug}.html">${s.title.replace(' Services', '')}</a></h3>
  <p>${esc(s.lede)}</p>
  <ul>${s.offerings.slice(0, 4).map(o => `<li>${icon('check')}${esc(o.t)}</li>`).join('')}</ul>
  <div class="scard__foot"><a class="link" href="${s.slug}.html">Learn more ${icon('arrow')}</a><a class="scard__book" href="book.html?service=${encodeURIComponent(bookMap(s.slug))}" data-book data-service="${bookMap(s.slug)}">Book</a></div>
</article>`;
function bookMap(slug) { return { heating: 'Heating', cooling: 'Cooling', 'heat-pumps': 'Heat pump', 'ventilation-air-quality': 'Air & ventilation', 'water-heaters': 'Water heater', 'water-treatment': 'Water treatment', plumbing: 'Plumbing', electrical: 'Electrical', commercial: 'Commercial', 'maintenance-plans': 'Not sure' }[slug]; }

const areasBlock = (full = false) => `<div class="areas ${full ? 'areas--full' : ''}">
  <label class="areas__search">${icon('search')}<input type="search" placeholder="Search your city or town…" aria-label="Search service areas"></label>
  <div class="areas__grid">
    ${areas.map(([r, cs]) => `<div class="areas__region"><h3>${r}</h3><ul>${cs.map(c => `<li id="${full ? c.toLowerCase().replace(/\W+/g, '-') : ''}"><a href="book.html?city=${encodeURIComponent(c)}" data-city="${c}">${icon('pin')}${c}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="areas__none" hidden>Don't see your town? <a href="book.html">Send a request</a> or call <a href="tel:${C.tel}">${C.phone}</a> — we'll confirm availability.</p>
</div>`;

write('index.html', `${head({ title: 'ZH Climate Solutions | Heating, Cooling, Plumbing & Electrical | Brampton, GTA & Ontario', desc: 'Book furnace, AC, heat pump, water heater, plumbing and electrical service online. Licensed & insured, free estimates, 24/7 emergency service across Brampton, the GTA and Ontario.', page: 'index', extraHead: localBusiness })}
<body class="home">
${header('home')}
<main id="main">
<section class="hero">
  <canvas id="heroGL" class="hero__gl" aria-hidden="true"></canvas>
  <div class="wrap hero__in">
    <div class="hero__copy">
      <p class="hero__slogan">${C.slogan}</p>
      <h1>Heating, cooling, plumbing &amp; electrical — <span class="hl">booked in minutes.</span></h1>
      <p class="hero__lede">One trusted local team for every system in your home or business. Serving Brampton, the GTA and communities across Ontario.</p>
      <ul class="hero__ticks">${trust.map(t => `<li>${icon('check')}${t.title}</li>`).join('')}</ul>
      <div class="hero__ctas">
        <a class="btn btn--navy btn--lg" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a>
        <a class="btn btn--line btn--lg" href="#services">Explore services</a>
      </div>
    </div>
    <div class="hero__book">${booking({ id: 'book', heading: 'Book your service', compact: true })}</div>
  </div>
</section>

<section class="trustbar">
  <div class="wrap trustbar__in">${trust.map(t => `<div class="trustbar__item">${icon(t.icon)}<div><b>${t.title}</b><span>${t.text}</span></div></div>`).join('')}</div>
</section>

${brandsBlock}

<section class="sec" id="services">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">What we do</p><h2 class="h2">Every system that keeps your property comfortable, safe and powered.</h2><p class="sec__sub">Installation, repair and maintenance for homes and businesses — from furnaces and heat pumps to drains, panels and water heaters.</p></div>
    <div class="sgrid">${services.map(serviceCard).join('')}</div>
  </div>
</section>

${emergency}

${process}

<section class="sec split">
  <div class="wrap split__grid">
    <article class="pcard reveal"><img src="img/tech-driveway.webp" alt="ZH Climate technician at a residential driveway in Brampton" loading="lazy"><div class="pcard__body"><p class="eyebrow eyebrow--light">Residential</p><h3>For your home</h3><ul><li>${icon('check')}Furnaces, AC &amp; heat pumps</li><li>${icon('check')}Water heaters &amp; plumbing repairs</li><li>${icon('check')}Lighting, outlets &amp; panel upgrades</li><li>${icon('check')}Air quality, humidity &amp; water treatment</li></ul><a class="btn btn--white" href="book.html?property=Residential" data-book>Book home service ${icon('arrow')}</a></div></article>
    <article class="pcard reveal"><img src="img/van-dusk.webp" alt="ZH Climate Solutions service van at a commercial plaza" loading="lazy"><div class="pcard__body"><p class="eyebrow eyebrow--light">Commercial</p><h3>For your business</h3><ul><li>${icon('check')}Commercial HVAC system maintenance</li><li>${icon('check')}Kitchen &amp; exhaust systems</li><li>${icon('check')}Commercial plumbing &amp; electrical</li><li>${icon('check')}Appliance &amp; building maintenance</li></ul><a class="btn btn--white" href="commercial.html">Commercial services ${icon('arrow')}</a></div></article>
  </div>
</section>

<section class="why">
  <div class="wrap why__grid">
    <div class="why__logo"><canvas id="logoGL" role="img" aria-label="ZH Climate Solutions logo"></canvas><p>${C.slogan}</p></div>
    <div>
      <p class="eyebrow eyebrow--light">Why ZH Climate</p>
      <h2 class="h2 h2--light">One call covers it all.</h2>
      <p class="why__lede">Most homes need an HVAC company, a plumber and an electrician. We are all three — so you deal with one team that understands how your systems work together.</p>
      <div class="why__list">
        <div>${icon('home')}<b>Four trades, one team</b><span>HVAC, plumbing, electrical and ventilation under one roof.</span></div>
        <div>${icon('shield')}<b>Licensed &amp; insured</b><span>Professional work you can rely on.</span></div>
        <div>${icon('tag')}<b>Free, upfront estimates</b><span>Clear options and pricing before work begins.</span></div>
        <div>${icon('clock')}<b>24/7 emergency response</b><span>Real help when something can't wait.</span></div>
        <div>${icon('pin')}<b>Local to Brampton</b><span>Serving neighbours across the GTA and Ontario.</span></div>
        <div>${icon('star')}<b>Quality workmanship</b><span>Done right, tested and cleaned up.</span></div>
      </div>
    </div>
  </div>
</section>

<section class="sec seasons" id="seasons">
  <div class="wrap seasons__grid">
    <div class="sec__head"><p class="eyebrow">Seasonal checklist</p><h2 class="h2">What does your home need right now?</h2><p class="sec__sub">Slide to today's outdoor temperature and we'll show what's worth checking.</p></div>
    <div class="planner lg">
      <div class="planner__top"><div class="planner__readout"><span id="pTemp">-8</span><sup>°C</sup></div><div class="planner__season" id="pSeason">Early winter</div></div>
      <label class="planner__slider"><span class="vh">Outdoor temperature</span><input type="range" id="pRange" min="-30" max="35" value="-8" step="1"><span class="planner__ticks" aria-hidden="true"><span>-30°</span><span>0°</span><span>+35°</span></span></label>
      <div class="planner__list" id="pList" aria-live="polite"></div>
      <a href="book.html" class="btn btn--hot" id="pCta" data-book data-service="Heating">Book a tune-up ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="sec sec--tint" id="areas">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Service areas</p><h2 class="h2">Proudly serving Brampton, the GTA and Ontario.</h2><p class="sec__sub">Find your community below — tap it to book in your area.</p></div>
    ${areasBlock()}
  </div>
</section>

<section class="sec gallery">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">On the road</p><h2 class="h2">Out in your neighbourhood.</h2></div>
    <div class="gal">
      <figure class="reveal"><img src="img/tech-street.webp" alt="ZH technician walking to a job" loading="lazy"></figure>
      <figure class="reveal"><img src="img/van-side.webp" alt="ZH Climate Solutions service van" loading="lazy"></figure>
      <figure class="reveal"><img src="img/van-rear.webp" alt="Rear of the ZH van with contact details" loading="lazy"></figure>
      <figure class="reveal"><img src="img/fleet.webp" alt="ZH Climate Solutions fleet branding" loading="lazy"></figure>
    </div>
  </div>
</section>

<section class="sec" id="faq">
  <div class="wrap faq__grid">
    <div class="sec__head"><p class="eyebrow">FAQ</p><h2 class="h2">Good questions, straight answers.</h2><p class="sec__sub">Can't find what you need? Call <a href="tel:${C.tel}">${C.phone}</a> or email <a href="mailto:${C.email}">${C.email}</a>.</p></div>
    ${faqList(generalFaqs)}
  </div>
</section>

${ctaBand('Comfort, safety and power — one call away.')}
</main>
${footer}
${scripts('\n<script src="js/app.bundle.js"></script>')}`);

/* ---------------- SERVICE PAGES ---------------- */
for (const s of services) {
  const others = services.filter(o => o.slug !== s.slug);
  const faqLd = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}</script>`;
  write(`${s.slug}.html`, `${head({ title: `${s.title} | Brampton, GTA & Ontario | ZH Climate Solutions`, desc: s.meta, page: s.slug, extraHead: faqLd })}
<body class="svcpage tone-${s.tone}">
${header(s.slug)}
<main id="main">
<section class="phero">
  <div class="wrap phero__in">
    <div class="phero__copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="index.html#services">Services</a><span>/</span><b>${s.nav}</b></nav>
      <div class="phero__ic">${icon(s.icon)}</div>
      <h1>${s.title}</h1>
      <p class="hero__lede">${esc(s.lede)}</p>
      <ul class="hero__ticks">${trust.map(t => `<li>${icon('check')}${t.title}</li>`).join('')}</ul>
      <div class="hero__ctas"><a class="btn btn--navy btn--lg" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a></div>
    </div>
    <div class="hero__book">${booking({ pre: bookMap(s.slug), id: 'book', heading: `Book ${s.name.toLowerCase()} service`, compact: true })}</div>
  </div>
</section>

${brandsBlock}

<section class="sec">
  <div class="wrap intro__grid">
    <div class="intro__text"><p class="eyebrow">Overview</p><h2 class="h2 h2--md">${s.name} service you can count on, from Brampton to across Ontario.</h2>${s.intro.map(p => `<p>${esc(p)}</p>`).join('')}</div>
    <aside class="signs lg"><h3>${icon('alert')} Signs you need service</h3><ul>${s.signs.map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn btn--hot btn--full" href="#book">Book a technician</a></aside>
  </div>
</section>

<section class="sec sec--tint">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">What we offer</p><h2 class="h2 h2--md">${s.name} services in detail</h2></div>
    <div class="offers">${s.offerings.map((o, i) => `<article class="offer reveal"><span class="offer__n">${String(i + 1).padStart(2, '0')}</span><h3><a href="${subFile(s, o)}">${esc(o.t)}</a></h3><p>${esc(o.d)}</p><div class="offer__foot"><a class="link" href="${subFile(s, o)}">Details ${icon('arrow')}</a><a class="offer__book" href="#book" data-visit="${visitFor(o.t)}">Book</a></div></article>`).join('')}</div>
  </div>
</section>

${emergency}
${process}

<section class="sec">
  <div class="wrap faq__grid">
    <div class="sec__head"><p class="eyebrow">${s.name} FAQ</p><h2 class="h2 h2--md">Common questions</h2></div>
    ${faqList(s.faqs)}
  </div>
</section>

<section class="sec sec--tint">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">More services</p><h2 class="h2 h2--md">Everything else we can help with</h2></div>
    <div class="minis">${others.map(o => `<a class="mini tone-${o.tone}" href="${o.slug}.html"><span class="mini__ic">${icon(o.icon)}</span><b>${o.nav}</b>${icon('arrow')}</a>`).join('')}</div>
  </div>
</section>

<section class="sec sec--tint">
  <div class="wrap">
    <div class="sec__head"><p class="eyebrow">Service areas</p><h2 class="h2 h2--md">${s.name} service across Ontario</h2></div>
    ${areasBlock()}
  </div>
</section>
${ctaBand(`Need ${s.name.toLowerCase()} help? We're ready.`)}
</main>
${footer}
${scripts()}`);
}

/* ---------------- SUB-PAGES (one per job) ---------------- */
for (const s of services) {
  s.offerings.forEach((o, i) => {
    const d = sub[s.slug][i], file = subFile(s, o), siblings = s.offerings.filter(x => x !== o);
    const faqs = d.faq.map(([q, a]) => ({ q, a }));
    const ld = `<script type="application/ld+json">${JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'Service', name: o.t, serviceType: s.title, provider: { '@type': 'HVACBusiness', name: C.name, telephone: '+1-647-614-4019' }, areaServed: 'Ontario, Canada', description: o.d },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', 'index.html'], [s.nav, s.slug + '.html'], [o.t, file]].map(([n, u], k) => ({ '@type': 'ListItem', position: k + 1, name: n, item: `${C.site}/${u}` })) },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    ])}</script>`;
    write(file, `${head({ title: `${o.t} | ${s.nav} | ZH Climate Solutions — Brampton & Ontario`, desc: `${o.d} ${C.name} serves Brampton, the GTA and Ontario. Call ${C.phone}.`, page: file.replace('.html', ''), extraHead: ld })}
<body class="svcpage subpage tone-${s.tone}">
${header(s.slug)}
<main id="main">
<section class="phero">
  <div class="wrap phero__in">
    <div class="phero__copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="index.html#services">Services</a><span>/</span><a href="${s.slug}.html">${s.nav}</a><span>/</span><b>${esc(o.t)}</b></nav>
      <div class="phero__ic">${icon(s.icon)}</div>
      <h1>${esc(o.t)}</h1>
      <p class="hero__lede">${esc(o.d)}</p>
      <ul class="hero__ticks">${trust.map(t => `<li>${icon('check')}${t.title}</li>`).join('')}</ul>
      <div class="hero__ctas"><a class="btn btn--navy btn--lg" href="tel:${C.tel}">${icon('phone')} Call ${C.phone}</a></div>
    </div>
    <div class="hero__book">${booking({ pre: bookMap(s.slug), id: 'book', heading: 'Book this service', compact: true, visit: visitFor(o.t) })}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap intro__grid">
    <div class="intro__text"><p class="eyebrow">About this service</p><h2 class="h2 h2--md">${esc(o.t)} in Brampton, the GTA and Ontario</h2>${d.p.map(x => `<p>${esc(x)}</p>`).join('')}
      <div class="subnav"><p class="subnav__t">More in ${s.nav.toLowerCase()}</p><div class="subnav__links">${siblings.map(x => `<a href="${subFile(s, x)}">${esc(x.t)}</a>`).join('')}<a href="${s.slug}.html"><b>All ${s.name.toLowerCase()} services</b></a></div></div>
    </div>
    <aside class="signs lg"><h3>${icon('check')} What's included</h3><ul>${d.inc.map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul><a class="btn btn--hot btn--full" href="#book" data-visit="${visitFor(o.t)}">Book ${esc(o.t.toLowerCase())}</a><a class="signs__call" href="tel:${C.tel}">${icon('phone')} Or call ${C.phone}</a></aside>
  </div>
</section>

${emergency}
${process}

<section class="sec">
  <div class="wrap faq__grid">
    <div class="sec__head"><p class="eyebrow">Questions</p><h2 class="h2 h2--md">${esc(o.t)} FAQ</h2><p class="sec__sub">More answers on our <a href="${s.slug}.html">${s.nav.toLowerCase()}</a> page.</p></div>
    ${faqList([...faqs, ...s.faqs.slice(0, 2)])}
  </div>
</section>

${brandsBlock}
${ctaBand(`Ready to book ${o.t.toLowerCase()}?`)}
</main>
${footer}
${scripts()}`);
  });
}

/* ---------------- SERVICE AREAS ---------------- */
write('service-areas.html', `${head({ title: 'Service Areas | HVAC, Plumbing & Electrical across Ontario | ZH Climate Solutions', desc: `ZH Climate Solutions serves ${allCities.slice(0, 12).join(', ')} and more communities across Ontario.`, page: 'service-areas' })}
<body>
${header('service-areas')}
<main id="main">
<section class="phero phero--simple"><div class="wrap"><nav class="crumbs"><a href="index.html">Home</a><span>/</span><b>Service Areas</b></nav><h1>Service areas</h1><p class="hero__lede">Based in Brampton and serving ${allCities.length}+ communities across the GTA and Ontario. Search for your town, then book in a few taps.</p></div></section>
<section class="sec"><div class="wrap">${areasBlock(true)}</div></section>
<section class="sec sec--tint"><div class="wrap">${booking({ id: 'book', heading: 'Book service in your area' })}</div></section>
</main>
${footer}
${scripts()}`);

/* ---------------- BOOK ---------------- */
write('book.html', `${head({ title: 'Book an Appointment | ZH Climate Solutions', desc: 'Book heating, cooling, plumbing or electrical service online with ZH Climate Solutions. 24/7 emergency service: 647-614-4019.', page: 'book' })}
<body class="bookpage">
${header('book')}
<main id="main">
<section class="phero phero--book">
  <div class="wrap phero__in">
    <div class="phero__copy">
      <nav class="crumbs"><a href="index.html">Home</a><span>/</span><b>Book</b></nav>
      <h1>Book an appointment</h1>
      <p class="hero__lede">Tell us what you need and when suits you. Our team will confirm your appointment by phone or email.</p>
      <div class="contact-cards">
        <a class="ccard lg" href="tel:${C.tel}">${icon('phone')}<span><small>Emergency? Call 24/7</small><b>${C.phone}</b></span></a>
        <a class="ccard lg" href="mailto:${C.email}">${icon('mail')}<span><small>Email us</small><b>${C.email}</b></span></a>
        <div class="ccard lg">${icon('pin')}<span><small>Based in</small><b>${C.base}</b></span></div>
      </div>
      <ul class="hero__ticks">${trust.map(t => `<li>${icon('check')}${t.title}</li>`).join('')}</ul>
    </div>
    <div class="hero__book">${booking({ id: 'book', heading: 'Request your appointment' })}</div>
  </div>
</section>
${process}
</main>
${footer}
${scripts()}`);

/* ---------------- PRIVACY ---------------- */
write('privacy.html', `${head({ title: 'Privacy | ZH Climate Solutions', desc: 'How ZH Climate Solutions handles information you share through this website.', page: 'privacy' })}
<body>
${header('privacy')}
<main id="main">
<section class="phero phero--simple"><div class="wrap"><nav class="crumbs"><a href="index.html">Home</a><span>/</span><b>Privacy</b></nav><h1>Privacy</h1></div></section>
<section class="sec"><div class="wrap prose">
<p>When you request an appointment or contact us, we collect the details you provide — such as your name, phone number, email, address and a description of the work — so we can respond to your request and schedule service.</p>
<p>We use this information only to communicate with you about your request and the services you ask for. We do not sell your personal information.</p>
<p>Booking requests are delivered to ZH Climate Solutions by email or through our form-delivery provider. This website does not use advertising cookies.</p>
<p>To ask about, correct or delete your information, contact <a href="mailto:${C.email}">${C.email}</a> or call <a href="tel:${C.tel}">${C.phone}</a>.</p>
</div></section>
</main>
${footer}
${scripts()}`);
/* ---------------- ASSISTANT KNOWLEDGE BASE ---------------- */
const kb = {
  company: C, trust: trust.map(t => t.title), brands: brands.map(([n, k]) => ({ n, k })), areas: areas.map(([r, c]) => ({ r, c })),
  faqs: generalFaqs,
  services: services.map(s => ({ slug: s.slug, name: s.name, nav: s.nav, title: s.title, lede: s.lede, book: bookMap(s.slug), signs: s.signs, faqs: s.faqs,
    subs: s.offerings.map((o, i) => ({ t: o.t, d: o.d, url: subFile(s, o), inc: sub[s.slug][i].inc })) }))
};
writeFileSync(path.join(root, 'js/kb.js'), '/* generated by build/build.mjs — do not edit */\nwindow.ZH_KB=' + JSON.stringify(kb) + ';\n');
writeFileSync(path.join(root, 'build/kb.json'), JSON.stringify(kb));
console.log('  ✓ js/kb.js');
console.log('Done.');
