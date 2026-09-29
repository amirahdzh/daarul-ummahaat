import type { CollectionConfig } from 'payload'

import { publishedOrAdmin } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'
import { previewUrl } from '../lib/preview'
import { validateHttpUrl } from '../lib/validators'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: { en: 'Program', id: 'Program' }, plural: { en: 'Programs', id: 'Program' } },
  admin: {
    group: { en: 'Programs', id: 'Program' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'programStatus', 'featured', '_status'],
    listSearchableFields: ['name', 'shortDescription'],
    preview: (doc) => (typeof doc?.slug === 'string' ? previewUrl(`/programs/${doc.slug}`) : null),
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
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { en: 'Program name', id: 'Nama program' },
    },
    slugField('name'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'program-categories',
      required: true,
      label: { en: 'Category', id: 'Kategori' },
      admin: { position: 'sidebar' },
    },
    {
      // Not called `status`: Payload's draft/publish state is `_status` and both would share one enum.
      name: 'programStatus',
      type: 'select',
      label: { en: 'Program status', id: 'Status program' },
      required: true,
      defaultValue: 'active',
      options: [
        { label: { en: 'Active', id: 'Aktif' }, value: 'active' },
        { label: { en: 'Seasonal', id: 'Musiman' }, value: 'seasonal' },
        { label: { en: 'Completed', id: 'Selesai' }, value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Show on the home page', id: 'Tampilkan di halaman beranda' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'The home page shows up to six featured programs.',
          id: 'Halaman beranda menampilkan hingga enam program unggulan.',
        },
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
      label: { en: 'Short description', id: 'Deskripsi singkat' },
      admin: {
        description: {
          en: 'Shown on program cards. Up to 200 characters.',
          id: 'Ditampilkan di kartu program. Maksimal 200 karakter.',
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Featured image', id: 'Gambar unggulan' },
      admin: {
        description: {
          en: 'Recommended. A landscape photo works best.',
          id: 'Disarankan. Foto lanskap (mendatar) hasilnya paling baik.',
        },
      },
    },
    {
      name: 'targetBeneficiaries',
      type: 'text',
      label: { en: 'Target beneficiaries', id: 'Sasaran penerima manfaat' },
    },
    {
      name: 'objectives',
      type: 'richText',
      label: { en: 'Program objectives', id: 'Tujuan program' },
    },
    {
      name: 'activities',
      type: 'richText',
      label: { en: 'Program activities', id: 'Kegiatan program' },
    },
    { name: 'location', type: 'text', label: { en: 'Location', id: 'Lokasi' } },
    {
      name: 'schedule',
      type: 'textarea',
      label: { en: 'Program schedule', id: 'Jadwal program' },
    },
    {
      name: 'gallery',
      type: 'join',
      collection: 'gallery-images',
      on: 'program',
      defaultLimit: 60,
      defaultSort: 'sortOrder',
      label: { en: 'Gallery', id: 'Galeri' },
      admin: {
        description: {
          en: 'Photos linked to this program. To add one, open it in Gallery photos and choose this program.',
          id: 'Foto yang tertaut ke program ini. Untuk menambahkan, buka di Foto galeri dan pilih program ini.',
        },
      },
    },
    {
      name: 'showDonationCta',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Show a donate button on this program',
        id: 'Tampilkan tombol donasi pada program ini',
      },
    },
    {
      name: 'registrationLink',
      type: 'text',
      label: { en: 'Registration link', id: 'Tautan pendaftaran' },
      validate: validateHttpUrl,
      admin: {
        description: {
          en: 'Optional. A web address, for example a Google Form. Leave empty for none.',
          id: 'Opsional. Alamat web, misalnya Google Form. Kosongkan jika tidak ada.',
        },
      },
    },
    seoField,
  ],
}
