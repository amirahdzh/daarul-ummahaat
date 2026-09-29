# Content Model

How the content in `docs/requirements.md` (sections 6 to 12 and 22) is modelled in Payload. The code is the source of truth: `src/collections/`, `src/globals/`, `src/fields/`.

## Collections and globals

| Requirement | Payload | Notes |
|---|---|---|
| Programs (§7) | Collection `programs` | Drafts and publishing. `programStatus`: Active, Seasonal, Completed |
| Program categories | Collection `program-categories` | Admin-managed, with a display order |
| Events (§8) | Collection `events` | Drafts and publishing. Adds an optional short description for cards (§17) |
| Event categories | Collection `event-categories` | Admin-managed |
| Gallery (§9) | Collection `gallery-images` (upload) | Bulk upload, caption, category, optional program and event, featured, display order |
| Gallery categories | Collection `gallery-categories` | Admin-managed |
| Impact statistics (§10) | Collection `impact-statistics` | Label, value as text (so "100+" works), display order, active flag |
| Legal documents (§12) | Collection `legal-documents` (upload) | PDF, JPG, PNG. Name, description, year, published flag |
| General images | Collection `media` (upload) | Featured images, hero, logo, QR codes, organisation photos |
| Home page content (§13) | Global `home-page` | Hero text and photo, about summary, donation call to action |
| Foundation profile (§11, §14) | Global `foundation-profile` | Profile, history, vision, mission, core values, structure, photos, SEO |
| Donation information (§20) | Global `donation-info` | Introduction, bank accounts, QRIS, e-wallets, WhatsApp confirmation |
| Contact information (§21) | Global `contact-info` | Address, phone, WhatsApp, email, Google Maps link and embed |
| Site settings | Global `site-settings` | Foundation name, tagline, logo, default SEO |
| Admin users | Collection `users` | One role for now. Only administrators have accounts |

## Decisions

- **Photos are linked from the photo side.** In Gallery photos an admin picks the program and/or event. The program and event pages list their own photos through a read-only `gallery` join field. This gives one place to upload and organise photos, and meets "associate images with program/event" (§9, §22).
- **Featured content is a checkbox.** Programs have "Show on the home page" and the home page takes up to six. Statistics use an active flag, and the latest events are picked by date.
- **Slugs** are generated from the name when left empty and always cleaned to URL-safe text. They are unique.
- **Draft and publish** applies to programs and events (§23). Visitors only ever see published documents, and only admins can see drafts. Impact statistics and legal documents use a simple published/active flag instead.
- **Ordering** uses a plain "Display order" number. Payload's drag-and-drop `orderable` option is marked experimental and likely to change, so it is not used.
- **Alt text** is required for general images. For gallery photos it is optional and falls back to the title, then the caption, then the file name, so bulk upload stays practical.
- **The program field is called `programStatus`**, not `status`. Payload's draft state is `_status`, and both would create the same database enum.
- **SEO** (§24) is a reusable group on programs, events and the About page: title, description, sharing image, and a hide-from-search-engines switch. Site settings hold the defaults.
- **WhatsApp numbers** are typed any way and stored as international digits (`0812-3456-7890` becomes `6281234567890`), ready for `wa.me` links. The donation confirmation link is built from the number and a ready-made message.
- **Menu** is defined in code for now. Requirements §4 only asks that it can grow, so it is not a content type yet.
- **Admin usability.** Programs and Events have a search box (`listSearchableFields`), and a "Preview" button on drafts that opens the real page before publishing (see `docs/frontend.md`, "Draft preview"). Rich text fields share one deliberately small toolbar (`src/lib/richText.ts`): paragraphs, H3/H4, bold, italic, links, lists and quotes, with an always-visible toolbar rather than the default's floating one.
- **Autofill.** The Slug field fills in live as an admin types the name (`src/fields/SlugFieldClient.tsx`), not only on save; editing it by hand stops it following, with a link to resync. The server (`src/fields/slug.ts`) still cleans and defaults it on save regardless, so this is a convenience, not the source of truth. Uploaded images (`media`, `gallery-images`) fall back to a readable version of the file name when the admin leaves the alt text empty (`humaniseFilename` in `src/fields/upload.ts`). A legal document's Year defaults to the current year.
- **SEO is collapsed by default.** The SEO group on Programs, Events and About, and the site-wide default SEO on Site settings, sit inside a section labelled "Advanced options", collapsed until clicked (`src/fields/advanced.ts`). It is purely a UI grouping: the stored data shape (`doc.seo.metaTitle`, etc.) is unchanged. Most pages never need to open it, since the site already falls back to the page title and short description automatically (`src/lib/seo.ts`).

## Access control

| Who | Can |
|---|---|
| Visitor | Read published programs and events, categories, gallery photos, active statistics, published legal documents, all globals. Nothing else |
| Signed-in admin | Everything, including drafts |

Every write requires sign-in. This is covered by tests in `tests/int/content-model.int.spec.ts`.

## Security choices

- Uploads are checked on the server by their real content, not just the file name. Photos allow JPEG, PNG and WebP. **SVG is not allowed** because it can carry scripts. Legal documents allow PDF, JPG and PNG. The maximum file size is 10 MB.
- Every link an admin can type (registration, video, Google Maps) must start with `http://` or `https://`, which blocks `javascript:` links.
- The Google Maps embed field only accepts addresses starting `https://www.google.com/maps/embed`, so an admin cannot embed an arbitrary page.
- Responsive image sizes (480, 960 and 1920 px wide, WebP) are generated once at upload, so the small server never resizes on demand.

## Not modelled yet

- **Contact form submissions and email delivery.** Planned with the Hostinger SMTP setup.
- **Database migrations.** Development uses Payload's automatic schema push. Production needs migrations, to be created when the schema settles, before the first deployment.
- **Roles.** Add only if more than one kind of admin is needed (§23).
- **Live preview.** Depends on the public pages existing.
- **Impact statistic icons.** The field exists (an image) but the design does not use icons yet.

## Starting data

`pnpm seed` (safe to run repeatedly) fills the whole site with realistic example content, so a fresh install looks and works like a real one instead of starting blank:

- the three program categories, six event categories and six gallery categories from the requirements;
- the 11 initial programs, as **drafts**, each with a generated placeholder photo, objectives, activities, a schedule and a target audience;
- 6 events (one per category), also as drafts, one deliberately dated in the past so both the "upcoming" and "past" states are visible;
- 14 gallery photos, several linked to a program or event, some marked "show on the home page";
- the 4 impact statistics from the requirements;
- one example legal document, unpublished;
- the Home, About, Donation and Contact page content, and the site logo (the real `public/brand/logo-emerald.png`).

**Every invented value is clearly marked "(Contoh)"** — bank account, address, email — so it is never mistaken for real information. Donation info in particular must be replaced with the foundation's real bank and e-wallet details before the site goes live; a fake-looking account number that a real visitor could send money to would be a serious problem otherwise.

Collections are matched by slug/title/name; globals are only filled in when they still look genuinely untouched (`fillGlobalIfEmpty` in `starterContent.ts`) — an admin's own edits, on any field, are never overwritten. Placeholder photos are generated on the fly with `sharp` (already a dependency), each labelled with its own caption, so nothing is mistaken for a real photo either.

The logic lives in `src/lib/starterContent.ts`, shared by the CLI script and by `src/lib/bootstrapStarterContent.ts`, which loads the same data into a live server when `SEED_STARTER_CONTENT=true` is set (see `docs/deployment.md`, "Loading the starter content"). A bug there is caught and logged rather than allowed to stop the server from starting.

## Working in the admin

Each item in the sidebar is grouped: Programs, Events, Gallery, Site content, Files. The first time the admin is opened Payload asks for the first administrator's email and password.

**The admin is in Indonesian by default.** Payload's own interface (buttons, menus, validation messages) and every field label, description, group and collection name in this codebase are translated, using Payload's built-in `{ en, id }` translation objects wherever a label or description is set (`src/payload.config.ts`, every file under `src/collections/`, `src/globals/` and `src/fields/`). Each admin account can still switch to English individually from the language menu in the top-right corner; this is a per-account preference, not a site-wide toggle, and switching does not affect what visitors see on the public pages. Validator error messages that Payload's translation system doesn't reach (`src/lib/validators.ts`, `src/lib/whatsapp.ts`) are translated separately via `src/lib/i18n.ts`, keyed off the signed-in admin's own language (`req.i18n.language`). Adding a new field: give it a `label`/`admin.description` as `{ en: '...', id: '...' }`, not a plain string, to keep this consistent.
