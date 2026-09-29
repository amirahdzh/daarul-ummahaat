import type { Field } from 'payload'

import { advancedSection } from './advanced'

/**
 * Editable search-engine and social-sharing metadata (requirements section 24). Collapsed by
 * default (see advanced.ts): the site already falls back to the page title and short
 * description automatically (see src/lib/seo.ts), so most pages never need to open this.
 */
export const seoField: Field = advancedSection([
  {
    name: 'seo',
    type: 'group',
    label: { en: 'Search and sharing (SEO)', id: 'Pencarian dan berbagi (SEO)' },
    admin: {
      description: {
        en: 'Optional. When left empty the page title and short description are used automatically.',
        id: 'Opsional. Jika dikosongkan, judul halaman dan deskripsi singkat akan digunakan secara otomatis.',
      },
    },
    fields: [
      {
        name: 'metaTitle',
        type: 'text',
        maxLength: 70,
        label: { en: 'Meta title', id: 'Judul meta' },
        admin: {
          description: {
            en: 'Title shown in Google results. Up to 70 characters.',
            id: 'Judul yang ditampilkan di hasil pencarian Google. Maksimal 70 karakter.',
          },
        },
      },
      {
        name: 'metaDescription',
        type: 'textarea',
        maxLength: 160,
        label: { en: 'Meta description', id: 'Deskripsi meta' },
        admin: {
          description: {
            en: 'Summary shown in Google results. Up to 160 characters.',
            id: 'Ringkasan yang ditampilkan di hasil pencarian Google. Maksimal 160 karakter.',
          },
        },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        label: { en: 'Sharing image', id: 'Gambar berbagi' },
        admin: {
          description: {
            en: 'Image shown when the page is shared on WhatsApp or social media.',
            id: 'Gambar yang ditampilkan saat halaman dibagikan di WhatsApp atau media sosial.',
          },
        },
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        label: { en: 'Hide from search engines', id: 'Sembunyikan dari mesin pencari' },
        defaultValue: false,
      },
    ],
  },
])
