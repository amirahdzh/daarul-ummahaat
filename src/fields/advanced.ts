import type { Field, StaticLabel } from 'payload'

const DEFAULT_LABEL: StaticLabel = { en: 'Advanced options', id: 'Opsi lanjutan' }

/**
 * Wraps fields in a section collapsed by default, for settings most admins never need to touch
 * (SEO metadata, sharing images). Purely a UI grouping: it adds no key to the stored data, so
 * any named field inside (for example a `group`) keeps its usual place in the document.
 */
export const advancedSection = (fields: Field[], label: StaticLabel = DEFAULT_LABEL): Field => ({
  type: 'collapsible',
  label,
  admin: { initCollapsed: true },
  fields,
})
