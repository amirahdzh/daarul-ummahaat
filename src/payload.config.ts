import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
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
import { adminTranslations } from './lib/adminTranslations'
import { bootstrapAdmin } from './lib/bootstrapAdmin'
import { bootstrapStarterContent } from './lib/bootstrapStarterContent'
import { emailAdapter } from './lib/email'
import { richText } from './lib/richText'
import { siteUrl } from './lib/site'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'
// Browsers may only use the admin and API from the public address (plus localhost when developing).
const allowedOrigins = [
  siteUrl(),
  ...(isProduction ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000']),
]

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | Daarul Ummahaat' },
    components: {
      // Big shortcut buttons for the common jobs, above Payload's list of collections.
      beforeDashboard: ['./components/admin/QuickActions.tsx#QuickActions'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // Admins are Indonesian speakers first; Indonesian is the default, English stays one click
  // away per account (top-right language switcher), never a global toggle.
  i18n: {
    supportedLanguages: { en, id },
    fallbackLanguage: 'id',
    // Plainer publish buttons and an Indonesian rich text editor (see the file for why).
    translations: adminTranslations,
  },
  // Order matters for the admin menu: groups appear in the order their first collection is listed,
  // so everyday content comes first and the "Lanjutan" (advanced) group last.
  collections: [
    Programs,
    Events,
    GalleryImages,
    ImpactStatistics,
    LegalDocuments,
    ProgramCategories,
    EventCategories,
    GalleryCategories,
    Media,
    Users,
  ],
  globals: [HomePage, FoundationProfile, DonationInfo, ContactInfo, SiteSettings],
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  editor: richText,
  secret: process.env.PAYLOAD_SECRET || '',
  cors: allowedOrigins,
  csrf: allowedOrigins,
  // Runs once-off bootstrap steps gated behind environment variables (see docs/deployment.md):
  // the first administrator (INITIAL_ADMIN_*) and the starter content (SEED_STARTER_CONTENT).
  onInit: async (payload) => {
    await bootstrapAdmin(payload)
    await bootstrapStarterContent(payload)
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // In production the schema only changes through migrations, which run automatically at startup.
    // Create one after any change to collections or globals: pnpm payload migrate:create <name>
    prodMigrations: migrations,
  }),
  // Real SMTP in production; unset locally, so emails are printed to the terminal instead.
  email: emailAdapter(),
  sharp,
  plugins: [],
})
