import type { GlobalConfig } from 'payload'

import { seoField } from '../fields/seo'

export const FoundationProfile: GlobalConfig = {
  slug: 'foundation-profile',
  label: { en: 'About the foundation', id: 'Tentang yayasan' },
  admin: {
    group: { en: 'Site content', id: 'Konten situs' },
    description: {
      en: 'Legal documents are managed under Legal documents.',
      id: 'Dokumen legal dikelola di menu Dokumen legal.',
    },
  },
  access: { read: () => true },
  fields: [
    {
      name: 'profile',
      type: 'richText',
      label: { en: 'Foundation profile', id: 'Profil yayasan' },
    },
    { name: 'history', type: 'richText', label: { en: 'History', id: 'Sejarah' } },
    { name: 'vision', type: 'textarea', label: { en: 'Vision', id: 'Visi' } },
    { name: 'mission', type: 'richText', label: { en: 'Mission', id: 'Misi' } },
    {
      name: 'coreValues',
      type: 'array',
      label: { en: 'Core values', id: 'Nilai-nilai inti' },
      labels: {
        singular: { en: 'Value', id: 'Nilai' },
        plural: { en: 'Values', id: 'Nilai-nilai' },
      },
      fields: [
        { name: 'title', type: 'text', required: true, label: { en: 'Title', id: 'Judul' } },
        {
          name: 'description',
          type: 'textarea',
          label: { en: 'Description', id: 'Deskripsi' },
        },
      ],
    },
    {
      name: 'organizationStructure',
      type: 'group',
      label: { en: 'Organization structure', id: 'Struktur organisasi' },
      fields: [
        {
          name: 'description',
          type: 'richText',
          label: { en: 'Description', id: 'Deskripsi' },
        },
        {
          name: 'chart',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Structure chart or diagram', id: 'Bagan atau diagram struktur' },
        },
      ],
    },
    {
      name: 'organizationPhotos',
      type: 'array',
      label: { en: 'Organization photos', id: 'Foto organisasi' },
      labels: {
        singular: { en: 'Photo', id: 'Foto' },
        plural: { en: 'Photos', id: 'Foto' },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { en: 'Image', id: 'Gambar' },
        },
        { name: 'caption', type: 'text', label: { en: 'Caption', id: 'Keterangan' } },
      ],
    },
    seoField,
  ],
}
