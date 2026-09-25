# Public Site (Frontend)

How the public pages are built. Requirements: `docs/requirements.md` sections 4, 5, 13 to 21, 24 to 26, 29 and 30. Visual reference: `docs/design-language.md`.

## Pages

| Address | Page | Notes |
|---|---|---|
| `/` | Home | Hero, About summary with category pillars, featured programs, impact statistics, latest events, gallery preview, donation call to action. Sections with no content are hidden |
| `/about` | About | Profile and history, vision and mission, core values, organization structure, legal documents |
| `/programs` | Programs archive | Category filter, pagination (12 per page) |
| `/programs/[slug]` | Program detail | Overview, objectives, activities, facts, schedule, gallery, donate, register and contact buttons |
| `/events` | Events archive | Category filter, newest or oldest first, pagination |
| `/events/[slug]` | Event detail | Date, time, place, description, gallery, registration, Google Maps and video links. Adds structured data |
| `/gallery` | Gallery | Category filter, lightbox, pagination (24 per page) |
| `/donate` | Donate | Bank accounts with copy button, QRIS, e-wallets, WhatsApp confirmation |
| `/contact` | Contact | Contact details, Google Maps embed, message form |
| `/sitemap.xml`, `/robots.txt` | SEO | Sitemap is built from published content |

Menu labels and interface copy are Indonesian. Addresses stay English, as in the requirements.

## Decisions

- **Plain CSS, no framework.** One stylesheet (`src/app/(frontend)/globals.css`) built from the design tokens as CSS variables. Tailwind would add a dependency and a build step for a site this size. Mobile-first, with two breakpoints (about 900 px and 1040 px).
- **Fonts through `next/font`.** Fraunces and Plus Jakarta Sans are downloaded at build time and served from the same origin, so visitors make no request to Google.
- **Plain `<img>` with a `srcset`, not the Next.js image optimiser.** Payload already creates 480, 960 and 1920 px WebP versions at upload. The optimiser would resize on demand and cost CPU on the small VPS. Images are lazy-loaded, except the first one on a page.
- **Pages are rendered per request** (`dynamic = 'force-dynamic'`). Admins change content at any time, and this keeps the build free of any database connection, which matters for Docker builds. Measured response is roughly 20 to 40 ms on the development machine. Cloudflare caching in front will absorb repeat visits. If needed later, this can move to static pages refreshed by Payload hooks when content is saved.
- **Filtering and pagination are plain links** (`?category=...&page=2`), so they work without JavaScript, can be shared, and are easy for search engines. Filtered views are marked `noindex` and point back to the main list.
- **The mobile menu, lightbox, copy button and contact form are the only client components.** Everything else is server-rendered HTML.
- **No search yet.** The requirements mark it optional and list it as future expansion.

## Data access

`src/lib/data.ts` is the only place pages read content. Every query uses `overrideAccess: false` and no user, so Payload's access rules decide what is visible: published programs and events, active statistics, published legal documents. Never drop that option.

Related helpers: `src/lib/media.ts` (responsive image sources), `src/lib/format.ts` (Indonesian dates in Jakarta time, WhatsApp and phone links, page parsing), `src/lib/seo.ts` (page metadata).

## SEO (requirements section 24)

- Each page sets a title, description, canonical address, Open Graph and Twitter card. Programs, events and About use the SEO group from the admin when filled in, then fall back to sensible defaults, then to site settings and a default share image.
- "Hide from search engines" in the admin sets `noindex` and removes the page from the sitemap.
- Structured data: `NonProfitOrganization` on the home page and `Event` on event pages.
- Semantic HTML: one `h1` per page, landmarks, breadcrumbs, descriptive link text.
- `SITE_URL` must be set in production. It builds canonical links, the sitemap and share images.

## Accessibility (requirements section 30)

Skip link, keyboard-operable menu (Escape closes it) and lightbox (arrow keys and Escape, native `<dialog>` focus handling), visible focus outlines, form labels with error messages linked by `aria-describedby`, live regions for form results and the copy button, and `prefers-reduced-motion` support. Text and control colours meet WCAG AA (see the contrast table in the design language).

## Contact form (requirements section 21)

1. Validation on the server (`src/lib/contact.ts`), with messages in Indonesian. WhatsApp number is optional and normalised.
2. Spam protection: a hidden honeypot field, a minimum time before submission, a maximum age, and a limit of 5 messages per visitor per 15 minutes. Bots that trip the honeypot see a normal success message but nothing is sent. Cloudflare Turnstile is planned as a stronger layer when Cloudflare is set up.
3. Delivery: an email to the address in Contact information (or `CONTACT_TO_EMAIL`), with the visitor's address as `Reply-To`. Line breaks are stripped from single-line fields so headers cannot be injected. Until an email adapter is configured (the Hostinger SMTP step), Payload writes the email to the server log, so the form can be tried locally.
4. Success and error states are shown on the page. Messages are **not stored**: if sending fails, the visitor sees an error and can use WhatsApp. Storing submissions is a possible later addition.

## Security

- Security headers on every response: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. The framework banner is removed.
- A Content Security Policy is set on the public pages in production builds (`next.config.ts`): same-origin scripts, styles, images, fonts and connections, plus Google Maps frames. Inline scripts are allowed because Next.js needs them for page data. When Cloudflare Turnstile is added, its domain must be allowed there. The admin is excluded. HTTPS and HSTS are handled by Caddy (`deploy/Caddyfile`) and Cloudflare.
- Uploaded photos are sent with a one-week cache header by the app itself (successful responses only). Page caching is decided by Cloudflare cache rules, see `docs/deployment.md`.
- Links and embeds entered in the admin are validated (see `docs/content-model.md`).

## Not done yet

- Email delivery through Hostinger SMTP, and Cloudflare Turnstile.
- Live preview of drafts from the admin.
- Cloudflare cache rules for pages and uploaded images.
- Browser and device testing (requirements section 36), and a Lighthouse run against production.
