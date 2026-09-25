import type { CollectionConfig } from 'payload'

import { flagOrAdmin } from '../access'

export const ImpactStatistics: CollectionConfig = {
  slug: 'impact-statistics',
  labels: { singular: 'Impact statistic', plural: 'Impact statistics' },
  admin: {
    group: 'Site content',
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
      admin: { description: 'For example: Yatim Dibina' },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: { description: 'Shown as typed, so "100+" and "1.000" both work.' },
    },
    { name: 'description', type: 'text' },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: { position: 'sidebar', description: 'Lower numbers come first.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on the website',
      admin: { position: 'sidebar' },
    },
  ],
}
