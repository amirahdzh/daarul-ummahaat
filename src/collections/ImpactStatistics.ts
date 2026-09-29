import type { CollectionConfig } from 'payload'

import { flagOrAdmin } from '../access'

export const ImpactStatistics: CollectionConfig = {
  slug: 'impact-statistics',
  labels: {
    singular: { en: 'Impact statistic', id: 'Statistik dampak' },
    plural: { en: 'Impact statistics', id: 'Statistik dampak' },
  },
  admin: {
    group: { en: 'Site content', id: 'Konten situs' },
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'sortOrder', 'active'],
  },
  access: {
    read: flagOrAdmin('active'),
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: { en: 'Label', id: 'Label' },
      admin: { description: { en: 'For example: Yatim Dibina', id: 'Misalnya: Yatim Dibina' } },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      label: { en: 'Value', id: 'Nilai' },
      admin: {
        description: {
          en: 'Shown as typed, so "100+" and "1.000" both work.',
          id: 'Ditampilkan persis seperti diketik, jadi "100+" dan "1.000" sama-sama bisa digunakan.',
        },
      },
    },
    { name: 'description', type: 'text', label: { en: 'Description', id: 'Deskripsi' } },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Icon', id: 'Ikon' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Display order', id: 'Urutan tampilan' },
      admin: {
        position: 'sidebar',
        description: { en: 'Lower numbers come first.', id: 'Angka lebih kecil ditampilkan lebih dulu.' },
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show on the website', id: 'Tampilkan di situs' },
      admin: { position: 'sidebar' },
    },
  ],
}
