import type { GlobalConfig } from 'payload'

import { advancedSection } from '../fields/advanced'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { en: 'Site settings', id: 'Pengaturan situs' },
  admin: { group: { en: 'Site content', id: 'Konten situs' } },
  access: { read: () => true },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Yayasan Daarul Ummahaat',
      label: { en: 'Foundation name', id: 'Nama yayasan' },
    },
    { name: 'tagline', type: 'text', label: { en: 'Tagline', id: 'Tagline' } },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Logo', id: 'Logo' },
      admin: {
        description: {
          en: 'The logo shown in the header and footer.',
          id: 'Logo yang ditampilkan di header dan footer.',
        },
      },
    },
    advancedSection([
      {
        name: 'defaultSeo',
        type: 'group',
        label: {
          en: 'Default search and sharing (SEO)',
          id: 'Pencarian dan berbagi default (SEO)',
        },
        admin: {
          description: {
            en: 'Used for pages that do not set their own.',
            id: 'Digunakan untuk halaman yang tidak memiliki pengaturannya sendiri.',
          },
        },
        fields: [
          {
            name: 'metaDescription',
            type: 'textarea',
            maxLength: 160,
            label: { en: 'Meta description', id: 'Deskripsi meta' },
          },
          {
            name: 'ogImage',
            type: 'upload',
            relationTo: 'media',
            label: { en: 'Sharing image', id: 'Gambar berbagi' },
          },
        ],
      },
    ]),
  ],
}
