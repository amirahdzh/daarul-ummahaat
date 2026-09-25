import type { Field } from 'payload'

/** Editable search-engine and social-sharing metadata (requirements section 24). */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search and sharing (SEO)',
  admin: {
    description:
      'Optional. When left empty the page title and short description are used automatically.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Title shown in Google results. Up to 70 characters.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
      admin: { description: 'Summary shown in Google results. Up to 160 characters.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Sharing image',
      admin: { description: 'Image shown when the page is shared on WhatsApp or social media.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Hide from search engines',
      defaultValue: false,
    },
  ],
}
