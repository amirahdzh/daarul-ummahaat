import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    group: 'Site content',
    description:
      'Featured programs, impact statistics, latest events and gallery photos are picked automatically.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'hero',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Main photo' },
      ],
    },
    {
      name: 'aboutSummary',
      type: 'textarea',
      label: 'About summary',
      admin: { description: 'Two or three sentences: who we are, our mission and our impact.' },
    },
    {
      name: 'donationCtaText',
      type: 'textarea',
      label: 'Donation call to action',
      defaultValue: 'Dukung misi kami dalam membina, mendidik, dan memberdayakan masyarakat.',
    },
  ],
}
