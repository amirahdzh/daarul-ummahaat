import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { EventCategories, GalleryCategories, ProgramCategories } from './collections/categories'
import { Events } from './collections/Events'
import { GalleryImages } from './collections/GalleryImages'
import { ImpactStatistics } from './collections/ImpactStatistics'
import { LegalDocuments } from './collections/LegalDocuments'
import { Media } from './collections/Media'
import { Programs } from './collections/Programs'
import { Users } from './collections/Users'
import { ContactInfo } from './globals/ContactInfo'
import { DonationInfo } from './globals/DonationInfo'
import { FoundationProfile } from './globals/FoundationProfile'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | Daarul Ummahaat' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Programs,
    ProgramCategories,
    Events,
    EventCategories,
    GalleryImages,
    GalleryCategories,
    ImpactStatistics,
    LegalDocuments,
    Media,
    Users,
  ],
  globals: [HomePage, FoundationProfile, DonationInfo, ContactInfo, SiteSettings],
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
