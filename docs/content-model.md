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

`pnpm seed` (safe to run repeatedly) creates:

- the three program categories, six event categories and six gallery categories from the requirements (gallery categories in Indonesian: Program, Acara, Ramadhan, Wisuda, Yatim, Umum), and
- the 11 initial programs as **drafts** with a placeholder description, so nothing half-written is public.

## Working in the admin

Each item in the sidebar is grouped: Programs, Events, Gallery, Site content, Files. The first time the admin is opened Payload asks for the first administrator's email and password.
