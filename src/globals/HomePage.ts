import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: { en: 'Home page', id: 'Halaman beranda' },
  admin: {
    group: { en: 'Site content', id: 'Konten situs' },
    description: {
      en: 'Featured programs, impact statistics, latest events and gallery photos are picked automatically.',
      id: 'Program unggulan, statistik dampak, acara terbaru, dan foto galeri dipilih secara otomatis.',
    },
  },
  access: { read: () => true },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: { en: 'Hero', id: 'Hero' },
      fields: [
        { name: 'headline', type: 'text', label: { en: 'Headline', id: 'Judul utama' } },
        {
          name: 'subheadline',
          type: 'textarea',
          label: { en: 'Subheadline', id: 'Sub-judul' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Main photo', id: 'Foto utama' },
        },
      ],
    },
    {
      name: 'aboutSummary',
      type: 'textarea',
      label: { en: 'About summary', id: 'Ringkasan tentang kami' },
      admin: {
        description: {
          en: 'Two or three sentences: who we are, our mission and our impact.',
          id: 'Dua atau tiga kalimat: siapa kami, misi kami, dan dampak kami.',
        },
      },
    },
    {
      name: 'donationCtaText',
      type: 'textarea',
      label: { en: 'Donation call to action', id: 'Ajakan berdonasi' },
      defaultValue: 'Dukung misi kami dalam membina, mendidik, dan memberdayakan masyarakat.',
    },
  ],
}
