/**
 * Lets an admin preview a draft on the real site before publishing it (Programs, Events).
 * The admin's "Preview" button links to /preview with a secret; that route enables Next.js
 * draft mode and redirects to the real page, which then fetches the draft version instead of
 * the published one (see getProgramBySlug/getEventBySlug in lib/data.ts).
 *
 * No new required configuration: falls back to PAYLOAD_SECRET when PREVIEW_SECRET is not set.
 * Set a dedicated PREVIEW_SECRET in production if you want to rotate it independently.
 */
export const previewSecret = (): string =>
  process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET || 'unset-preview-secret'

/** The URL Payload's admin links a document's "Preview" button to. `path` must be site-relative. */
export const previewUrl = (path: string): string =>
  `/preview?secret=${encodeURIComponent(previewSecret())}&path=${encodeURIComponent(path)}`

/** True only for an internal path such as "/programs/x". Guards against an open redirect. */
export const isSafePreviewPath = (path: string | null): path is string =>
  typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
