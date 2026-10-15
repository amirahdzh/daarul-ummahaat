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
    {
      name: 'hijriDayAdjustment',
      type: 'number',
      min: -2,
      max: 2,
      defaultValue: 0,
      label: { en: 'Hijri date correction (days)', id: 'Koreksi tanggal Hijriah (hari)' },
      admin: {
        step: 1,
        description: {
          en: 'Hijri dates on events are calculated automatically (Umm al-Qura) and can differ by a day or two from the Indonesian government announcement. Enter 1 to move all Hijri dates one day later, -1 one day earlier, 0 for no correction. Change it when the announcement for the current month differs.',
          id: 'Tanggal Hijriah pada acara dihitung otomatis (Umm al-Qura) dan bisa berbeda satu atau dua hari dari pengumuman pemerintah Indonesia. Isi 1 untuk memajukan semua tanggal Hijriah satu hari, -1 untuk memundurkan satu hari, 0 tanpa koreksi. Ubah jika pengumuman bulan berjalan berbeda.',
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
