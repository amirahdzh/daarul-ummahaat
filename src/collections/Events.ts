import type { CollectionConfig } from 'payload'

import { publishedOrAdmin } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { validateHttpUrl } from '../lib/validators'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    group: 'Events',
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventDate', 'category', '_status'],
  },
  access: {
    read: publishedOrAdmin,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  defaultSort: '-eventDate',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Event name' },
    slugField('name'),
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
    {
      name: 'eventTime',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional, for example 08.00 - 12.00 WIB.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'event-categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'Shown on event cards. Up to 200 characters.' },
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'location', type: 'text' },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: 'Google Maps link',
      validate: validateHttpUrl,
    },
    { name: 'description', type: 'richText' },
    {
      name: 'registrationLink',
      type: 'text',
      validate: validateHttpUrl,
      admin: { description: 'Optional. Leave empty if no registration is needed.' },
    },
    {
      name: 'videoLink',
      type: 'text',
      validate: validateHttpUrl,
      admin: { description: 'Optional. For example a YouTube link.' },
    },
    {
      name: 'gallery',
      type: 'join',
      collection: 'gallery-images',
      on: 'event',
      defaultLimit: 60,
      defaultSort: 'sortOrder',
      admin: {
        description:
          'Photos linked to this event. To add one, open it in Gallery photos and choose this event.',
      },
    },
    seoField,
  ],
}
