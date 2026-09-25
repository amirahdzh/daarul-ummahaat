# Architecture Decision Record — Yayasan Daarul Ummahaat Website

**Status:** Accepted in discussion (2026-09-26), pending implementation
**Related:** `docs/requirements.md`

This record captures the technology and architecture decision that `docs/requirements.md` (§3, §32, §42) deliberately left open. It does not change any functional requirement.

---

## 1. Context

### What drives the decision

- Content is small and changes rarely: about 11 initial programs, a few events, a modest photo gallery. The organisation is small.
- Almost all traffic is read-only public browsing. There are no user accounts and no payments in the MVP (§40). "Donate" means showing bank, QRIS and e-wallet details plus a WhatsApp link (§20).
- Only two parts need a server: the admin (authentication and uploads) and the contact form (validation, spam protection, email delivery).
- Admins are non-technical (§23). The admin UI may be in English. Website content is in Indonesian.
- Agent compatibility is rated High (§33, §42): schema, config and infrastructure should live in code and be reproducible.
- Future expansion (online donation, donor data, blog, search, multi-language; §41) should not be made unnecessarily hard, but is not built now.

### Constraints established during discussion

| Constraint | Detail |
|---|---|
| Hosting | Own OVHcloud VPS-1: 2 vCores, 4 GB RAM, 40 GB NVMe, OVH daily snapshot (previous 24 h only) |
| Ops skill | Owner is very comfortable with server administration and wants to build these skills |
| Language | TypeScript |
| Audience | Indonesia |
| Domain | Registered at Hostinger. DNS is planned to move to Cloudflare (not yet done) |
| Existing service | Hostinger "Premium" shared web hosting, including email for the domain |
| Edge | Owner is open to Cloudflare in front of the site |
| Off-server backup | None yet |

---

## 2. Decision

Build a single TypeScript application using **Payload CMS embedded in Next.js**, backed by **PostgreSQL**, deployed with **Docker Compose** on the OVH VPS behind **Caddy** and **Cloudflare**.

| Concern | Choice |
|---|---|
| Admin and content model | Payload CMS (schema defined in code, admin UI generated) |
| Public site | Next.js, rendered by the same app |
| Database | PostgreSQL (container on the VPS) |
| Media | Local persistent volume on the VPS for the MVP. Payload's storage adapters allow a later move to S3-compatible storage without changing the content model |
| Reverse proxy / origin TLS | Caddy |
| Edge | Cloudflare (DNS, TLS, caching, DDoS protection) |
| Contact form email | SMTP through a dedicated mailbox on the existing Hostinger email, via `@payloadcms/email-nodemailer` |
| Spam protection | Cloudflare's captcha alternative (Turnstile), to be confirmed at implementation |
| Deployment definition | Compose files, Caddy config and scripts in the repository |

---

## 3. Alternatives considered

| Alternative | Why not chosen |
|---|---|
| Django or Laravel with a generated admin | Lighter and very stable, but outside the owner's strongest language. More work for gallery and image polish |
| Strapi or Directus | A separate service, so more RAM and more moving parts than Payload embedded in Next.js |
| WordPress-class CMS | Ongoing plugin patching, content model configured in the GUI and database (poor for agents), no maintainer familiarity argument in its favour |
| SaaS headless CMS (Sanity, Contentful, etc.) | The VPS removes its main benefit (no server to run). Adds a recurring fee and lock-in |
| Git-based CMS with static output | Cheapest to run, but weakest admin experience for non-technical editors and clumsy gallery relations and bulk upload |
| Hand-built admin | Over-engineering. Payload provides this |
| Site builders (Wix, Squarespace) | Limited SEO and code-level control, poor fit for agent-driven development |

---

## 4. Trade-offs and consequences

**Benefits**

- One codebase and one deploy. Schema, admin, public site and infrastructure are all code in the repository.
- Best editor experience of the self-hosted options.
- No vendor lock-in for content: it lives in the owner's own Postgres. Payload is open source.
- A real backend and database exist for future donation and donor features.
- The infrastructure work (Compose, Caddy, Postgres, backups, hardening) supports the owner's skills goal.

**Costs and risks**

| Risk | Mitigation |
|---|---|
| Payload is younger and moves faster than Django or Laravel | Pin versions. Keep the content model small. Treat upgrades as deliberate, tested work |
| Heaviest option on the VPS | 4 GB RAM is comfortable (Payload's own guidance is at least 1 GB). Generate image sizes at upload and let Cloudflare cache them, since 2 vCores are the tighter limit |
| Backups, patching and hardening are the owner's responsibility | Documented runbooks (see requirements §27, §37) and an off-server backup with a tested restore |
| Single VPS is one failure domain | Documented and tested recovery procedure. Email stays on Hostinger, independent of the VPS |
| 40 GB disk can fill | Monitor disk. Keep local backups short-lived. Move media to object storage if the gallery grows |
| Coupling to Cloudflare | Cloudflare is used for DNS and caching, which are replaceable. Nothing in the application depends on it beyond the optional captcha |

---

## 5. Target topology

```text
Cloudflare (DNS, TLS, cache, DDoS protection)
        ↓
OVH VPS: Caddy (reverse proxy, origin TLS)
        ↓
Payload + Next.js container  →  Postgres container
        ↓
Media volume (local)

Nightly job: pg_dump + media → encrypted → off-server storage
Contact form email: app → Hostinger SMTP
```

Hardening baseline for the VPS: SSH keys only, firewall, unattended security updates, and origin access restricted to Cloudflare where practical. Admin access should have strong passwords and, where supported, two-factor authentication.

---

## 6. Backup and recovery (requirements §27)

Two layers:

1. **OVH daily snapshot.** Already available. It keeps only the previous 24 hours and is a whole-VM snapshot at the same provider, so it does not satisfy the retention requirement by itself.
2. **Nightly application-level backup** of the Postgres dump and the media directory, encrypted and pushed to storage off the VPS. Retention target: 7 daily and 4 weekly copies (to be confirmed).

**Decision (2026-09-26): the destination for layer 2 is Cloudflare R2**, since Cloudflare is already planned for DNS and caching. Its free tier was reported as 10 GB-month of storage with free egress, which should be enough at this scale (re-check current pricing when creating the bucket). The backup bucket must be separate from any future media bucket, with its own scoped API token.

A restore must be tested before handover (requirements §39, item 15).

Hostinger shared hosting as backup storage is not planned. Shared-hosting terms often restrict its use for backups, and it is less reliable than object storage.

---

## 7. Contact form email

Send notifications over authenticated SMTP using a **dedicated mailbox** on the Hostinger email for the domain, for example `website@<domain>`, never a person's own mailbox. Credentials go in environment secrets, not in the repository. Staff read notifications in whichever mailbox they choose.

Notes:

- Sending limits: third-party sources report 500 messages per hour over SMTP on Hostinger shared plans. Hostinger's own documentation lists per-mailbox daily limits of 1000 or 3000 for its email plans. Neither is the exact figure for this mailbox and plan, so this must be confirmed in hPanel. Either comfortably exceeds contact-form volume.
- SMTP host and port are taken from hPanel. They were not confirmed in this research.
- Use SMTP over port 465 or 587. Port 25 is commonly blocked from VPS providers and should not be relied on.
- After the form works, send test messages to Gmail and other providers and confirm SPF, DKIM and DMARC pass.
- Fallback if deliverability is poor: a transactional email provider. Only the transport settings change.

---

## 8. DNS migration (Hostinger registrar → Cloudflare DNS)

The domain stays registered at Hostinger. Only the nameservers change to Cloudflare's. Because Hostinger email depends on DNS records, the order matters.

1. Add the domain to Cloudflare and let it import existing records.
2. Compare the imported records against Hostinger's DNS zone. Make sure **MX, SPF, DKIM and any autodiscover or mail-related records** are present, and add a DMARC record.
3. Set mail-related records (MX, and any `mail` hostnames) to **DNS only**, not proxied. Cloudflare's proxy does not carry mail traffic.
4. Note anything else currently served from the domain (for example an existing Hostinger website). Moving DNS affects it.
5. Change the nameservers at the Hostinger registrar to Cloudflare's.
6. Verify web and mail after propagation. Send and receive a test email.
7. Point the website's A record at the VPS, proxied, once the site is ready.

---

## 9. Verification status

Checked during this discussion (web search, not hands-on testing):

- Payload 3.x embeds in Next.js and supports PostgreSQL and Docker self-hosting. Its deployment guidance recommends Next.js `standalone` output, and persistent filesystems such as a VPS can store uploads locally. The Docker example uses Node 24 Alpine, and one guide states a minimum of 1 GB RAM.
- `@payloadcms/email-nodemailer` exists and supports SMTP transports.
- Cloudflare R2 free tier figures as quoted in section 6.
- Hostinger sending limits as described in section 7.

Verified hands-on during scaffolding (2026-09-26): the blank Payload template with the Postgres adapter installs, type-checks, lints, passes its integration test against a local Postgres 17 container, and builds for production. Versions in use: Payload 3.90.2, Next.js 16.3.3, React 19.2.6, Node 24 (development), pnpm 11.28.0 (pinned via `packageManager`). Payload 3.90.2 declares Next.js `>=16.3.3 <17` as a supported range.

**Not verified. Confirm before or during implementation:**

- Hostinger SMTP host, port and the actual limits for this plan and mailbox.
- Cloudflare Turnstile with Payload or Next.js forms.
- Whether the Hostinger plan permits any additional use beyond email.

---

## 10. Open items

- Confirm the backup retention policy (7 daily and 4 weekly proposed) and create the R2 bucket and token.
- Decide on staging: none at first, or a second Compose project on a subdomain of the same VPS.
- Confirm the Postgres choice against SQLite. Postgres is recommended for future donor data.
- Decide how many admin accounts and whether roles are needed (requirements §23).
- Confirm what else, if anything, is served from the domain today.

---

## 11. Next steps

Progress: steps 1 and 2 are done (repository initialised, blank Payload and Next.js project scaffolded and verified). The visual direction is recorded in `docs/design-language.md`. Remaining order:

1. ~~`git init` and set up the repository, with lint, type-check and formatting configuration.~~
2. ~~Verify current versions and scaffold the Payload and Next.js project.~~
3. Model the content types from requirements §7 to §12 as Payload collections and globals.
4. Build the public pages (requirements §13 to §21).
5. Write the Compose, Caddy and backup setup, and deploy to the VPS.
6. Move DNS to Cloudflare and configure email.
7. Test, including restore and cross-browser checks, then write the usage and technical documentation (requirements §36 to §38).
