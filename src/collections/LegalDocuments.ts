import type { CollectionConfig } from 'payload'

import { flagOrAdmin } from '../access'
import { mediaDir } from '../lib/mediaDir'
import { validateYear } from '../lib/validators'

export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  labels: {
    singular: { en: 'Legal document', id: 'Dokumen legal' },
    plural: { en: 'Legal documents', id: 'Dokumen legal' },
  },
  admin: {
    group: { en: 'Site content', id: 'Konten situs' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'year', 'published'],
  },
  access: {
    read: flagOrAdmin('published'),
  },
  defaultSort: '-year',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Document name', id: 'Nama dokumen' },
    },
    { name: 'description', type: 'textarea', label: { en: 'Description', id: 'Deskripsi' } },
    {
      name: 'year',
      type: 'number',
      label: { en: 'Year', id: 'Tahun' },
      // A function default only applies when creating a new document, never overwriting a saved one.
      defaultValue: () => new Date().getFullYear(),
      validate: validateYear,
      admin: { step: 1 },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Publish on the website', id: 'Publikasikan di situs' },
      admin: { position: 'sidebar' },
    },
  ],
  upload: {
    staticDir: mediaDir('legal-documents'),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
}
