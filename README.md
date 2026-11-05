# ZH Climate Solutions Inc. — Website

Website for ZH Climate Solutions Inc., a heating, cooling, plumbing and electrical company serving Brampton, the GTA and Ontario. It's built to get appointments booked.

## Run it
    npm start      →  http://127.0.0.1:4173   (Ctrl+C to stop)
No npm install needed. You can also open `public/index.html` directly in a browser.

## Project structure
```
public/                      the website (this is the folder you host)
  index.html                 homepage with booking in the hero
  book.html                  booking page
  service-areas.html         50+ Ontario communities, with search
  privacy.html
  config.js                  form endpoint, chat setting, phone and email
  robots.txt, _headers       crawler rules, security headers for static hosts
  services/<service>/
    index.html               service overview (10 services)
    <job>.html               one page per job (54 pages)
  assets/
    css/                     style.css, fonts.css
    js/                      main.js, chat.js, kb.js (generated), app.bundle.js (generated)
    img/                     optimised photos
    favicon.svg
server/
  server.mjs                 local and production server for public/ and /api/chat
  chat-core.mjs              AI chat backend (reads the API key from the environment)
  kb.json                    chat knowledge base (generated)
  netlify-chat.mjs           optional Netlify Function wrapper
src/
  content/data.mjs           all site text: services, areas, brands, FAQs, trust points
  content/subpages.mjs       text for each job page
  build/build.mjs            page generator (writes public/*.html and the knowledge base)
  build/icons.mjs            icon set
  3d/                        homepage 3D gradient and chrome logo (source of app.bundle.js)
```

## Editing content
Edit the text in `src/content/`, then run:
    npm run build
This regenerates every page in `public/`. Styling is in `public/assets/css/style.css`. To change the homepage 3D, edit `src/3d/` and run `npm run build:3d`.

## Features
- **Booking form** on the homepage, booking page and every service page, in 3 steps: service, then day and arrival window, then contact details. There's an "urgent" option that tells people to call.
- **Two-level Services menu**: hover a service to see its job pages. On phones, each service expands.
- **"Book a free consultation" panel**: an orange tab on the right edge of every page opens a quick call-back form.
- **Chat assistant** on every page:
  - Built-in mode (default) answers about services, areas, brands, FAQs and pricing policy, gives safety guidance for gas smells, CO alarms, sparks and floods, and can fill in the booking form.
  - AI mode: set an Anthropic API key before starting the server:
        Windows (Command Prompt):  set ANTHROPIC_API_KEY=your-key  then  npm start
        Windows (PowerShell):      $env:ANTHROPIC_API_KEY="your-key" ; npm start
        Mac/Linux:                 ANTHROPIC_API_KEY=your-key npm start
    Optional CLAUDE_MODEL overrides the default model (claude-haiku-5-5). On static hosting without a server, the chat uses built-in mode automatically.
  - Safety questions are always answered by the built-in rules.

## Receiving bookings
By default a booking opens the visitor's email app with everything filled in, addressed to zhclimatesolutions@gmail.com.
**Recommended before launch:** create a free form at https://formspree.io (or https://web3forms.com) and paste the URL into `public/config.js` → `formEndpoint`. Bookings will then go straight to the inbox.

## Deploying
- **Vercel** (set up in `vercel.json`): import this repo at vercel.com/new and click Deploy, with no settings to change. Every push to `main` redeploys automatically. While the site is a prototype, `vercel.json` sends `X-Robots-Tag: noindex` so search engines don't list it. Remove that header at launch.
- **Static host** (Netlify, Cloudflare Pages, Vercel): publish the `public/` folder. Security headers come from `public/_headers`.
- **Node host** (for AI chat): run `npm start` with HOST=0.0.0.0 behind HTTPS, and set ANTHROPIC_API_KEY in the host's environment settings (plus ALLOWED_ORIGINS=https://your-domain, and TRUST_PROXY=1 behind a reverse proxy).

## Before launch — confirm with the client
- The claims used come from ZH's own flyers: licensed and insured, free estimates, 24/7 emergency service.
- Confirm the service-area list and that every listed service is offered.
- Add real Google reviews, licence numbers and any warranty or financing details once you have them.

## Security
- **No secrets in the code.** The API key is read only from the environment on the server and is never sent to the browser. `.gitignore` blocks `.env` files.
- **The server only serves files in public/**, through an allowlist. Source code, server files and dot-files return 404, including upper/lower-case tricks on Windows.
- **Headers**: CSP, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy (plus HSTS on static hosts).
- **Chat API**: same-site requests only, JSON only, 16 KB body limit, 12 messages per minute per visitor, a site-wide hourly cap (AI_HOURLY_LIMIT, default 300) and a 20-second timeout.
- **Forms**: length limits, a phone check, a spam honeypot, and everything shown back is escaped. They only post to https form services.
- **No logins, accounts, database or stored personal data.**
