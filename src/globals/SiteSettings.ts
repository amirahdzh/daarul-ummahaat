import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site content' },
  access: { read: () => true },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Yayasan Daarul Ummahaat',
      label: 'Foundation name',
    },
    { name: 'tagline', type: 'text' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'The logo shown in the header and footer.' },
    },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default search and sharing (SEO)',
      admin: { description: 'Used for pages that do not set their own.' },
      fields: [
        { name: 'metaDescription', type: 'textarea', maxLength: 160 },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Sharing image' },
      ],
    },
  ],
}
