import type { GlobalConfig } from 'payload'

import { seoField } from '../fields/seo'

export const FoundationProfile: GlobalConfig = {
  slug: 'foundation-profile',
  label: 'About the foundation',
  admin: {
    group: 'Site content',
    description: 'Legal documents are managed under Legal documents.',
  },
  access: { read: () => true },
  fields: [
    { name: 'profile', type: 'richText', label: 'Foundation profile' },
    { name: 'history', type: 'richText' },
    { name: 'vision', type: 'textarea' },
    { name: 'mission', type: 'richText' },
    {
      name: 'coreValues',
      type: 'array',
      label: 'Core values',
      labels: { singular: 'Value', plural: 'Values' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'organizationStructure',
      type: 'group',
      label: 'Organization structure',
      fields: [
        { name: 'description', type: 'richText' },
        {
          name: 'chart',
          type: 'upload',
          relationTo: 'media',
          label: 'Structure chart or diagram',
        },
      ],
    },
    {
      name: 'organizationPhotos',
      type: 'array',
      label: 'Organization photos',
      labels: { singular: 'Photo', plural: 'Photos' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    seoField,
  ],
}
