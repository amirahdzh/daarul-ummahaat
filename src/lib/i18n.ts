/**
 * Picks Indonesian or English text for admin-facing messages that Payload's own translation
 * system doesn't reach, such as validator error strings (see docs/content-model.md). Field
 * labels/descriptions use Payload's native `{ en, id }` StaticLabel objects instead; this is
 * only for plain strings built at runtime.
 */
export const t = (language: string | undefined, en: string, id: string): string =>
  language === 'en' ? en : id
