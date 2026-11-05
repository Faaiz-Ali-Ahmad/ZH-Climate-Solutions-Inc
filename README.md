# ZH Climate Solutions Inc. — Website

A professional multi-page site built to get appointments booked.

## Run it
    npm start      →  http://127.0.0.1:4173   (Ctrl+C to stop)
Double-clicking index.html also works. No npm install needed.

## Pages
- index.html: homepage with the booking widget in the hero, services, emergency banner, how it works, residential/commercial, why ZH, seasonal checklist, service areas, FAQ
- heating, cooling, heat-pumps, ventilation-air-quality, water-heaters, water-treatment, plumbing, electrical, commercial, maintenance-plans (.html): detailed service pages, each with its own pre-filled booking form, "signs you need service", detailed offerings and FAQs
- service-areas.html: 50+ Ontario communities grouped by region, with search
- book.html: dedicated booking page
- privacy.html

## Booking form
It's a 3-step form: service → day and arrival window → contact details. There's an "urgent" option that tells people to call.
By default a booking opens the visitor's email app with everything filled in, addressed to zhclimatesolutions@gmail.com.
**Recommended before launch:** create a free form at https://formspree.io (or https://web3forms.com) and paste the URL into `config.js` → `formEndpoint`. Bookings will then arrive in the inbox directly, with no email app needed.


## New in this version
- **54 detailed sub-pages** (one per job, e.g. heating-furnace-repair.html), each with an overview, what's included, FAQs, related jobs and a pre-filled booking form. Content lives in build/subpages.mjs.
- **Two-level Services menu**: hover a service to see its sub-pages. On phones, each service expands.
- **Floating "Book a free consultation" panel** on every page (orange tab on the right edge), with a quick call-back form. It's hidden on phones, where the bottom Call / Book bar takes over.
- **ZH Assistant chat** (bottom-right) on every page:
  - Built-in mode (default, no setup): answers about services, sub-services, service areas, brands, FAQs and pricing policy, and gives safety guidance for gas smells, CO alarms, sparks and floods. It can pre-fill the booking form or open the call-back panel.
  - AI mode (Claude): run the site with `npm start` and set your Anthropic API key first:
        Windows (PowerShell):  $env:ANTHROPIC_API_KEY="sk-ant-..." ; npm start
        Mac/Linux:             ANTHROPIC_API_KEY=sk-ant-... npm start
    The key stays on the server (api/chat-core.mjs) and is never sent to the browser. Optional CLAUDE_MODEL overrides the default model (claude-haiku-5-5).
    On static hosting without a server, the chat automatically uses built-in mode. For Netlify, see api/netlify-chat.mjs.
  - Safety questions are always answered by the built-in rules, never by the AI.

## Editing content
All text lives in `build/data.mjs` (services, service areas, FAQs, trust points). After editing, run:
    npm run build
to regenerate every page. Styling is in style.css. The homepage 3D (gradient + chrome logo) source is in src/ (rebuild with `npm run build:3d`).

## Before launch — confirm with the client
- The claims used are the ones on ZH's own flyers: licensed & insured, free estimates, 24/7 emergency service. Confirm they're accurate.
- Confirm the service-area list and that every listed service is offered.
- Add real Google reviews, licence numbers (e.g. TSSA/ESA) and any warranty or financing details once you have them. None were invented here.

## Security
- **API keys**: there are none in the code. The AI key is read only from the ANTHROPIC_API_KEY environment variable on the server and is never sent to the browser. Never paste it into config.js or any HTML/JS file. A .gitignore blocks .env files if you use git later.
- **Server (server.mjs)** serves an allowlist of public files only. Source code (src/, build/, api/), server files, package.json, README and dot-files return 404, including upper/lower-case tricks on Windows.
- **Headers**: CSP, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy are sent by server.mjs, and by `_headers` on Netlify or Cloudflare Pages (which also adds HSTS).
- **Chat API**: same-site requests only (set ALLOWED_ORIGINS for your live domain if needed). JSON only, 16 KB body limit, 12 messages per minute per visitor, AI_HOURLY_LIMIT site-wide cap (default 300/hour), 20-second timeout, and generic error messages.
- **Forms**: length limits, phone check, a honeypot against spam bots, and everything shown back is escaped. They only post to https form services.
- **No admin area, logins, user accounts, database or stored passwords**: the site keeps no personal data. Booking requests go straight to email or the form service.
- **Static hosting**: run `npm run dist` and publish ONLY the dist/ folder.
- **Going live**: use HTTPS, put the key in the host's environment settings, and set HOST=0.0.0.0 only behind a reverse proxy (with TRUST_PROXY=1).
