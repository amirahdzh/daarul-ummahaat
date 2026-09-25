import type { CollectionConfig } from 'payload'

import { publishedOrAdmin } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { validateHttpUrl } from '../lib/validators'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Program', plural: 'Programs' },
  admin: {
    group: 'Programs',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'programStatus', 'featured', '_status'],
  },
  access: {
    read: publishedOrAdmin,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Program name' },
    slugField('name'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'program-categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      // Not called `status`: Payload's draft/publish state is `_status` and both would share one enum.
      name: 'programStatus',
      type: 'select',
      label: 'Program status',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Seasonal', value: 'seasonal' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on the home page',
      admin: {
        position: 'sidebar',
        description: 'The home page shows up to six featured programs.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'Shown on program cards. Up to 200 characters.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Recommended. A landscape photo works best.' },
    },
    { name: 'targetBeneficiaries', type: 'text', label: 'Target beneficiaries' },
    { name: 'objectives', type: 'richText', label: 'Program objectives' },
    { name: 'activities', type: 'richText', label: 'Program activities' },
    { name: 'location', type: 'text' },
    { name: 'schedule', type: 'textarea', label: 'Program schedule' },
    {
      name: 'gallery',
      type: 'join',
      collection: 'gallery-images',
      on: 'program',
      defaultLimit: 60,
      defaultSort: 'sortOrder',
      admin: {
        description:
          'Photos linked to this program. To add one, open it in Gallery photos and choose this program.',
      },
    },
    {
      name: 'showDonationCta',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show a donate button on this program',
    },
    {
      name: 'registrationLink',
      type: 'text',
      label: 'Registration link',
      validate: validateHttpUrl,
      admin: {
        description: 'Optional. A web address, for example a Google Form. Leave empty for none.',
      },
    },
    seoField,
  ],
}
