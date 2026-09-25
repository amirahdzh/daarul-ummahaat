import type { CollectionConfig } from 'payload'

import { flagOrAdmin } from '../access'
import { mediaDir } from '../lib/mediaDir'
import { validateYear } from '../lib/validators'

export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  labels: { singular: 'Legal document', plural: 'Legal documents' },
  admin: {
    group: 'Site content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'published'],
  },
  access: {
    read: flagOrAdmin('published'),
  },
  defaultSort: '-year',
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Document name' },
    { name: 'description', type: 'textarea' },
    { name: 'year', type: 'number', validate: validateYear, admin: { step: 1 } },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publish on the website',
      admin: { position: 'sidebar' },
    },
  ],
  upload: {
    staticDir: mediaDir('legal-documents'),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
}
