import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { bulletList, paragraph, richDoc } from './lexical'
import { placeholderFile } from './placeholderImage'
import { slugify } from './slugify'

/**
 * Fills the site with realistic-looking example content: the categories and programs listed in
 * docs/requirements.md, plus events, gallery photos, impact statistics, a legal document, and
 * the "about", donation and contact globals. Used by the `pnpm seed` CLI script (development)
 * and by bootstrapStarterContent (production, gated behind SEED_STARTER_CONTENT).
 *
 * Safe to run more than once: collections are matched by name/title/slug and left alone if
 * already present; globals are only filled in when they still look untouched (see
 * fillGlobalIfEmpty). Nothing here is ever deleted, and an admin's own edits are never
 * overwritten.
 *
 * Everything invented (bank details, contact address, profile text) is clearly marked
 * "(Contoh)" so it is never mistaken for real information. Replace it before the site goes live.
 */

type MinimalPayload = Pick<Payload, 'find' | 'create' | 'findGlobal' | 'updateGlobal' | 'logger'>
type Id = number

const PROGRAM_CATEGORIES = ['Pendidikan', 'Pembinaan Yatim', 'Kesejahteraan Masyarakat']
const EVENT_CATEGORIES = ['Kajian', 'Pelatihan', 'Santunan', 'Ramadhan', 'Wisuda', 'Kegiatan Yatim']
// The requirements list these in English; the site itself is Indonesian, so they are seeded that way.
// Admins can rename them at any time.
const GALLERY_CATEGORIES = ['Program', 'Acara', 'Ramadhan', 'Wisuda', 'Yatim', 'Umum']

/* ---------- Programs ---------- */

type ProgramSeed = {
  name: string
  featured?: boolean
  status: 'active' | 'seasonal' | 'completed'
  targetBeneficiaries: string
  objectivesIntro: string
  objectives: string[]
  activitiesIntro: string
  activities: string[]
  location: string
  schedule: string
  registrationLink?: string
}

const PROGRAMS: Record<string, ProgramSeed[]> = {
  Pendidikan: [
    {
      name: 'Beasiswa Kuliah',
      featured: true,
      status: 'active',
      targetBeneficiaries: 'Mahasiswa yatim dan dhuafa berprestasi',
      objectivesIntro:
        'Program ini bertujuan membantu mahasiswa yatim dan dhuafa untuk dapat melanjutkan pendidikan tinggi tanpa terkendala biaya.',
      objectives: [
        'Meringankan biaya kuliah bagi mahasiswa yatim dan dhuafa berprestasi',
        'Mendorong semangat belajar dan prestasi akademik',
        'Membentuk generasi yang mandiri dan bermanfaat bagi masyarakat',
      ],
      activitiesIntro:
        'Kegiatan dilaksanakan setiap semester melalui proses seleksi dan pendampingan.',
      activities: [
        'Seleksi penerima beasiswa berdasarkan kondisi ekonomi dan prestasi',
        'Penyaluran dana beasiswa setiap semester',
        'Pendampingan dan monitoring perkembangan akademik penerima manfaat',
      ],
      location: 'Jakarta dan sekitarnya',
      schedule: 'Pendaftaran dibuka setiap awal semester (Januari dan Juli)',
      registrationLink: 'https://forms.gle/contoh-beasiswa-kuliah',
    },
    {
      name: 'Tahsin Tahfizh Gratis Yatim Dhuafa',
      featured: true,
      status: 'active',
      targetBeneficiaries: 'Anak yatim dan dhuafa usia sekolah',
      objectivesIntro:
        "Membekali anak-anak yatim dan dhuafa dengan kemampuan membaca Al-Qur'an yang baik dan benar serta menghafalkannya.",
      objectives: [
        "Memperbaiki bacaan Al-Qur'an (tahsin) peserta",
        "Membimbing peserta menghafal Al-Qur'an secara bertahap",
        "Menanamkan kecintaan terhadap Al-Qur'an sejak dini",
      ],
      activitiesIntro: 'Kegiatan berlangsung rutin setiap pekan dengan bimbingan pengajar tahfizh.',
      activities: [
        "Kelas tahsin bacaan Al-Qur'an",
        'Setoran hafalan mingguan',
        'Evaluasi dan penilaian perkembangan hafalan',
      ],
      location: 'Yayasan Daarul Ummahaat',
      schedule: 'Setiap Sabtu dan Ahad, pukul 08.00 - 10.00 WIB',
    },
    {
      name: 'Bimbel Gratis',
      status: 'active',
      targetBeneficiaries: 'Anak yatim, dhuafa, dan masyarakat sekitar usia sekolah',
      objectivesIntro:
        'Memberikan bimbingan belajar gratis untuk membantu anak-anak yatim dan dhuafa mengejar ketertinggalan akademik.',
      objectives: [
        'Membantu siswa memahami mata pelajaran sekolah',
        'Meningkatkan minat belajar anak-anak',
        'Menyediakan akses pendidikan tambahan tanpa biaya',
      ],
      activitiesIntro: 'Bimbingan belajar dilaksanakan oleh relawan pengajar.',
      activities: [
        'Bimbingan mata pelajaran utama (Matematika, Bahasa Indonesia, IPA)',
        'Pendampingan tugas sekolah',
        'Kegiatan literasi dan membaca',
      ],
      location: 'Yayasan Daarul Ummahaat',
      schedule: 'Setiap Selasa dan Kamis, pukul 16.00 - 17.30 WIB',
    },
    {
      name: 'Sanlat Yatim dan Santri Tahfizh',
      status: 'seasonal',
      targetBeneficiaries: 'Anak yatim dan santri tahfizh',
      objectivesIntro:
        "Kegiatan pesantren kilat untuk memperkuat pemahaman agama dan hafalan Al-Qur'an anak yatim dan santri.",
      objectives: [
        'Meningkatkan pemahaman ilmu agama peserta',
        "Memperkuat hafalan dan bacaan Al-Qur'an",
        'Mempererat ukhuwah antar peserta',
      ],
      activitiesIntro: 'Dilaksanakan setiap tahun pada masa libur sekolah.',
      activities: [
        'Kajian dan materi keislaman',
        "Setoran dan muroja'ah hafalan",
        'Kegiatan kebersamaan dan permainan edukatif',
      ],
      location: 'Yayasan Daarul Ummahaat',
      schedule: 'Libur semester, jadwal menyesuaikan setiap tahun',
    },
    {
      name: 'Wisuda 30 Juz',
      status: 'seasonal',
      targetBeneficiaries: 'Santri tahfizh yang telah menyelesaikan hafalan 30 juz',
      objectivesIntro:
        "Mengapresiasi dan meresmikan kelulusan santri yang telah menyelesaikan hafalan Al-Qur'an 30 juz.",
      objectives: [
        "Mengapresiasi pencapaian santri penghafal Al-Qur'an",
        'Memotivasi santri lain untuk menyelesaikan hafalan',
        'Melibatkan orang tua dan masyarakat dalam mensyukuri pencapaian ini',
      ],
      activitiesIntro: 'Acara wisuda diselenggarakan setiap tahun.',
      activities: [
        'Ujian akhir hafalan 30 juz',
        'Prosesi wisuda dan pemberian sertifikat',
        'Tasyakuran bersama keluarga santri',
      ],
      location: 'Aula Yayasan Daarul Ummahaat',
      schedule: 'Setahun sekali, jadwal menyesuaikan',
    },
  ],
  'Pembinaan Yatim': [
    {
      name: 'Santunan Yatim',
      featured: true,
      status: 'active',
      targetBeneficiaries: 'Anak yatim di sekitar wilayah yayasan',
      objectivesIntro: 'Memberikan bantuan rutin untuk memenuhi kebutuhan dasar anak yatim.',
      objectives: [
        'Memenuhi sebagian kebutuhan hidup dan pendidikan anak yatim',
        'Memberikan perhatian dan pembinaan rutin',
        'Meringankan beban wali/pengasuh anak yatim',
      ],
      activitiesIntro: 'Santunan disalurkan secara rutin setiap bulan.',
      activities: [
        'Penyaluran santunan bulanan',
        'Pembinaan dan bimbingan rohani',
        'Pendataan dan monitoring kondisi anak yatim',
      ],
      location: 'Wilayah binaan Yayasan Daarul Ummahaat',
      schedule: 'Setiap bulan, pekan pertama',
    },
    {
      name: 'Bukber Bareng Yatim',
      status: 'seasonal',
      targetBeneficiaries: 'Anak yatim dan dhuafa',
      objectivesIntro:
        'Mempererat kebersamaan dengan anak yatim melalui acara buka puasa bersama di bulan Ramadhan.',
      objectives: [
        'Menghadirkan momen kebersamaan di bulan Ramadhan',
        'Memberikan hiburan dan semangat bagi anak yatim',
        'Menguatkan silaturahmi antara yayasan, donatur, dan anak yatim',
      ],
      activitiesIntro: 'Diselenggarakan setiap bulan Ramadhan.',
      activities: ['Buka puasa bersama', 'Tausiyah singkat', 'Pembagian bingkisan Ramadhan'],
      location: 'Aula Yayasan Daarul Ummahaat',
      schedule: 'Bulan Ramadhan, jadwal menyesuaikan',
    },
    {
      name: 'Rihlah Yatim',
      featured: true,
      status: 'active',
      targetBeneficiaries: 'Anak yatim binaan yayasan',
      objectivesIntro:
        'Memberikan kesempatan rekreasi dan pembelajaran di luar ruangan bagi anak-anak yatim.',
      objectives: [
        'Memberikan hiburan dan pengalaman baru bagi anak yatim',
        'Membangun kebersamaan dan kekompakan antar peserta',
        'Menyegarkan kembali semangat belajar anak-anak',
      ],
      activitiesIntro: 'Kegiatan dilaksanakan sekali dalam setahun.',
      activities: [
        'Kunjungan ke tempat wisata edukatif',
        'Permainan dan outbound',
        'Pembagian bekal dan suvenir',
      ],
      location: 'Menyesuaikan tujuan wisata',
      schedule: 'Setahun sekali, jadwal menyesuaikan',
    },
  ],
  'Kesejahteraan Masyarakat': [
    {
      name: 'Santunan Dhuafa',
      featured: true,
      status: 'active',
      targetBeneficiaries: 'Keluarga dhuafa di sekitar wilayah yayasan',
      objectivesIntro:
        'Membantu meringankan beban ekonomi keluarga dhuafa di sekitar wilayah yayasan.',
      objectives: [
        'Memenuhi sebagian kebutuhan pokok keluarga dhuafa',
        'Memberikan perhatian kepada masyarakat kurang mampu',
        'Mendorong kepedulian sosial dari para donatur',
      ],
      activitiesIntro: 'Bantuan disalurkan secara berkala.',
      activities: [
        'Pendataan keluarga dhuafa',
        'Penyaluran sembako dan bantuan lainnya',
        'Kunjungan dan silaturahmi ke penerima manfaat',
      ],
      location: 'Wilayah binaan Yayasan Daarul Ummahaat',
      schedule: 'Setiap bulan',
    },
    {
      name: 'Pengajian Ibu-Ibu',
      status: 'active',
      targetBeneficiaries: 'Ibu-ibu di lingkungan sekitar yayasan',
      objectivesIntro:
        'Menyediakan wadah untuk menambah ilmu agama bagi ibu-ibu di lingkungan sekitar.',
      objectives: [
        'Meningkatkan pemahaman ilmu agama peserta',
        'Mempererat silaturahmi antar warga',
        'Menjadi sarana dakwah rutin di lingkungan sekitar',
      ],
      activitiesIntro: 'Pengajian dilaksanakan secara rutin setiap pekan.',
      activities: [
        'Kajian tematik keislaman',
        'Tanya jawab seputar materi kajian',
        'Silaturahmi dan ramah tamah',
      ],
      location: 'Yayasan Daarul Ummahaat',
      schedule: 'Setiap Jumat, pukul 09.00 - 11.00 WIB',
    },
    {
      name: "Sahur I'tikaf",
      status: 'seasonal',
      targetBeneficiaries: 'Jamaah dan masyarakat sekitar',
      objectivesIntro:
        "Memfasilitasi masyarakat untuk beri'tikaf dan menghidupkan malam-malam akhir Ramadhan.",
      objectives: [
        "Memfasilitasi kegiatan i'tikaf di 10 hari terakhir Ramadhan",
        'Menyediakan sahur bersama bagi jamaah',
        'Menghidupkan suasana ibadah di bulan Ramadhan',
      ],
      activitiesIntro: 'Diselenggarakan pada 10 hari terakhir Ramadhan.',
      activities: [
        "I'tikaf dan qiyamul lail berjamaah",
        'Penyediaan sahur bersama',
        'Kajian menjelang sahur',
      ],
      location: 'Masjid mitra Yayasan Daarul Ummahaat',
      schedule: '10 hari terakhir bulan Ramadhan',
    },
  ],
}

/* ---------- Events ---------- */

type EventSeed = {
  name: string
  category: string
  offsetDays: number
  time: string
  location: string
  shortDescription: string
  description: string
  registrationLink?: string
  videoLink?: string
}

const daysFromNow = (offsetDays: number): string => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + offsetDays)
  date.setUTCHours(2, 0, 0, 0) // ~09:00 WIB
  return date.toISOString()
}

const EVENTS: EventSeed[] = [
  {
    name: 'Kajian Ahad Pagi',
    category: 'Kajian',
    offsetDays: 14,
    time: '07.00 - 09.00 WIB',
    location: 'Aula Yayasan Daarul Ummahaat',
    shortDescription: 'Kajian rutin membahas tema-tema keislaman untuk masyarakat umum.',
    description:
      'Kajian Ahad Pagi terbuka untuk umum dan diselenggarakan secara rutin. Setiap pekan mengangkat tema yang berbeda, disampaikan oleh ustadz tamu maupun pengajar tetap yayasan.',
  },
  {
    name: 'Pelatihan Guru Tahfizh',
    category: 'Pelatihan',
    offsetDays: 30,
    time: '08.00 - 15.00 WIB',
    location: 'Yayasan Daarul Ummahaat',
    shortDescription: 'Pelatihan untuk meningkatkan kompetensi para pengajar tahfizh yayasan.',
    description:
      "Pelatihan ini bertujuan meningkatkan metode mengajar tahsin dan tahfizh Al-Qur'an bagi para pengajar di lingkungan yayasan, agar proses belajar santri semakin efektif.",
    registrationLink: 'https://forms.gle/contoh-pelatihan-guru',
  },
  {
    name: 'Santunan Yatim Bulanan',
    category: 'Santunan',
    offsetDays: 7,
    time: '09.00 - 12.00 WIB',
    location: 'Wilayah binaan Yayasan Daarul Ummahaat',
    shortDescription: 'Penyaluran santunan rutin bulanan bagi anak yatim binaan yayasan.',
    description:
      'Santunan bulanan disalurkan langsung kepada anak yatim binaan yayasan, mencakup bantuan biaya hidup dan pendidikan.',
  },
  {
    name: 'Buka Puasa Bersama Yatim',
    category: 'Ramadhan',
    offsetDays: 120,
    time: '17.00 - 19.00 WIB',
    location: 'Aula Yayasan Daarul Ummahaat',
    shortDescription: 'Momen kebersamaan berbuka puasa bersama anak-anak yatim di bulan Ramadhan.',
    description:
      'Acara buka puasa bersama menghadirkan anak-anak yatim, donatur, dan pengurus yayasan dalam suasana kekeluargaan, diisi dengan tausiyah singkat dan pembagian bingkisan Ramadhan.',
  },
  {
    name: 'Wisuda Tahfizh 30 Juz',
    category: 'Wisuda',
    offsetDays: -10,
    time: '09.00 - 12.00 WIB',
    location: 'Aula Yayasan Daarul Ummahaat',
    shortDescription: 'Prosesi wisuda bagi santri yang telah menyelesaikan hafalan 30 juz.',
    description:
      "Acara wisuda mengapresiasi para santri yang telah menyelesaikan hafalan Al-Qur'an 30 juz, dihadiri oleh keluarga santri, donatur, dan tamu undangan.",
    videoLink: 'https://youtube.com/contoh-video-wisuda',
  },
  {
    name: 'Rihlah dan Outbound Yatim',
    category: 'Kegiatan Yatim',
    offsetDays: 45,
    time: '07.00 - 16.00 WIB',
    location: 'Menyesuaikan tujuan wisata',
    shortDescription:
      'Kegiatan rekreasi dan permainan edukatif untuk anak-anak yatim binaan yayasan.',
    description:
      'Rihlah tahunan mengajak anak-anak yatim berekreasi sekaligus belajar melalui permainan outbound, diakhiri dengan pembagian bekal dan suvenir.',
  },
]

/* ---------- Impact statistics ---------- */

const IMPACT_STATISTICS = [
  { label: 'Yatim Dibina', value: '100+', description: 'Sejak yayasan berdiri' },
  { label: 'Mahasiswa Mendapat Beasiswa', value: '50+', description: '' },
  { label: 'Huffazh Lulus Wisuda', value: '30+', description: '' },
  { label: 'Penerima Manfaat', value: '1000+', description: 'Dari seluruh program' },
]

/* ---------- Gallery photos ---------- */

type GallerySeed = {
  title: string
  category: string
  programSlug?: string
  eventSlug?: string
  featured?: boolean
}

const GALLERY: GallerySeed[] = [
  {
    title: 'Kegiatan Beasiswa Kuliah',
    category: 'Program',
    programSlug: 'beasiswa-kuliah',
    featured: true,
  },
  {
    title: 'Kegiatan Tahsin Tahfizh',
    category: 'Program',
    programSlug: 'tahsin-tahfizh-gratis-yatim-dhuafa',
  },
  {
    title: 'Santunan Yatim Bulanan',
    category: 'Yatim',
    programSlug: 'santunan-yatim',
    featured: true,
  },
  { title: 'Rihlah Yatim Bersama', category: 'Yatim', programSlug: 'rihlah-yatim', featured: true },
  { title: 'Santunan Dhuafa', category: 'Program', programSlug: 'santunan-dhuafa' },
  { title: 'Kajian Ahad Pagi', category: 'Acara', eventSlug: 'kajian-ahad-pagi', featured: true },
  { title: 'Pelatihan Guru Tahfizh', category: 'Acara', eventSlug: 'pelatihan-guru-tahfizh' },
  {
    title: 'Buka Puasa Bersama Yatim',
    category: 'Ramadhan',
    eventSlug: 'buka-puasa-bersama-yatim',
    featured: true,
  },
  { title: "Sahur I'tikaf Bersama", category: 'Ramadhan', programSlug: 'sahur-i-tikaf' },
  {
    title: 'Wisuda Tahfizh 30 Juz',
    category: 'Wisuda',
    eventSlug: 'wisuda-tahfizh-30-juz',
    featured: true,
  },
  { title: 'Wisuda 30 Juz Tahun Lalu', category: 'Wisuda', programSlug: 'wisuda-30-juz' },
  { title: 'Rihlah dan Outbound Yatim', category: 'Yatim', eventSlug: 'rihlah-dan-outbound-yatim' },
  { title: 'Kebersamaan di Yayasan', category: 'Umum', featured: true },
  { title: 'Kegiatan Yayasan', category: 'Umum' },
]

/* ---------- Helpers ---------- */

const ensureCategories = async (
  payload: MinimalPayload,
  collection: 'program-categories' | 'event-categories' | 'gallery-categories',
  names: string[],
): Promise<Map<string, Id>> => {
  const ids = new Map<string, Id>()
  for (const [index, name] of names.entries()) {
    const slug = slugify(name)
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs[0]) {
      ids.set(name, existing.docs[0].id as Id)
      continue
    }
    const created = await payload.create({ collection, data: { name, slug, sortOrder: index } })
    ids.set(name, created.id as Id)
    payload.logger.info(`Created ${collection}: ${name}`)
  }
  return ids
}

/**
 * Only fills a global's fields when `isEmpty` says it still looks untouched. `buildData` is a
 * thunk, not a plain object: it may itself create placeholder images, and those must never run
 * (and clutter the media library) on a global that is already filled in — so it is only called
 * after `isEmpty` says this is actually needed.
 */
const fillGlobalIfEmpty = async (
  payload: MinimalPayload,
  slug: 'home-page' | 'foundation-profile' | 'donation-info' | 'contact-info' | 'site-settings',
  isEmpty: (current: Record<string, unknown>) => boolean,
  buildData: () => Promise<Record<string, unknown>>,
): Promise<void> => {
  const current = (await payload.findGlobal({ slug })) as unknown as Record<string, unknown>
  if (!isEmpty(current)) return
  const data = await buildData()
  await payload.updateGlobal({ slug, data })
  payload.logger.info(`Filled in starter content for ${slug}`)
}

const readPublicImage = (relativePath: string): Buffer | null => {
  try {
    return fs.readFileSync(path.join(process.cwd(), relativePath))
  } catch {
    return null
  }
}

/**
 * Creates a Media document and returns its id, for `upload`/`relationTo: 'media'` fields
 * (Program.featuredImage, HomePage.hero.image, ...). Those fields store a reference to an
 * existing Media document, not an inline file — unlike `gallery-images` and `legal-documents`,
 * which are upload-enabled collections in their own right and take `file` directly on create.
 */
const createMediaImage = async (
  payload: MinimalPayload,
  filename: string,
  alt: string,
  seed: number,
  size?: { width?: number; height?: number },
): Promise<Id> => {
  const file = await placeholderFile(filename, alt, seed, size)
  const created = await payload.create({ collection: 'media', data: { alt }, file })
  return created.id as Id
}

/* ---------- Main ---------- */

export const createStarterContent = async (payload: MinimalPayload): Promise<void> => {
  const programCategoryIds = await ensureCategories(
    payload,
    'program-categories',
    PROGRAM_CATEGORIES,
  )
  const eventCategoryIds = await ensureCategories(payload, 'event-categories', EVENT_CATEGORIES)
  const galleryCategoryIds = await ensureCategories(
    payload,
    'gallery-categories',
    GALLERY_CATEGORIES,
  )

  // ---- Programs ----
  const programIds = new Map<string, Id>()
  let imageSeed = 0
  for (const [categoryName, programs] of Object.entries(PROGRAMS)) {
    for (const program of programs) {
      const slug = slugify(program.name)
      const existing = await payload.find({
        collection: 'programs',
        draft: true,
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs[0]) {
        programIds.set(slug, existing.docs[0].id as Id)
        continue
      }
      const featuredImage = await createMediaImage(
        payload,
        `${slug}.jpg`,
        program.name,
        imageSeed++,
      )
      const created = await payload.create({
        collection: 'programs',
        // Drafts, so nothing half-written is public. Admins review and publish each one.
        draft: true,
        data: {
          name: program.name,
          slug,
          category: programCategoryIds.get(categoryName)!,
          programStatus: program.status,
          featured: program.featured ?? false,
          shortDescription:
            `${program.objectivesIntro} Program ini ditujukan bagi ${program.targetBeneficiaries.toLowerCase()}.`.slice(
              0,
              200,
            ),
          featuredImage,
          targetBeneficiaries: program.targetBeneficiaries,
          objectives: richDoc(paragraph(program.objectivesIntro), bulletList(program.objectives)),
          activities: richDoc(paragraph(program.activitiesIntro), bulletList(program.activities)),
          location: program.location,
          schedule: program.schedule,
          registrationLink: program.registrationLink,
        },
      })
      programIds.set(slug, created.id as Id)
      payload.logger.info(`Created draft program: ${program.name}`)
    }
  }

  // ---- Events ----
  const eventIds = new Map<string, Id>()
  for (const event of EVENTS) {
    const slug = slugify(event.name)
    const existing = await payload.find({
      collection: 'events',
      draft: true,
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      eventIds.set(slug, existing.docs[0].id as Id)
      continue
    }
    const featuredImage = await createMediaImage(payload, `${slug}.jpg`, event.name, imageSeed++)
    const created = await payload.create({
      collection: 'events',
      // Drafts, same reasoning as programs: an admin reviews and publishes each one.
      draft: true,
      data: {
        name: event.name,
        slug,
        eventDate: daysFromNow(event.offsetDays),
        eventTime: event.time,
        category: eventCategoryIds.get(event.category),
        shortDescription: event.shortDescription,
        featuredImage,
        location: event.location,
        description: richDoc(paragraph(event.description)),
        registrationLink: event.registrationLink,
        videoLink: event.videoLink,
      },
    })
    eventIds.set(slug, created.id as Id)
    payload.logger.info(`Created draft event: ${event.name}`)
  }

  // ---- Gallery photos ----
  for (const photo of GALLERY) {
    const existing = await payload.find({
      collection: 'gallery-images',
      where: { title: { equals: photo.title } },
      limit: 1,
    })
    if (existing.docs[0]) continue
    const file = await placeholderFile(`${slugify(photo.title)}.jpg`, photo.title, imageSeed++, {
      width: 1000,
      height: 750,
    })
    await payload.create({
      collection: 'gallery-images',
      data: {
        title: photo.title,
        category: galleryCategoryIds.get(photo.category),
        program: photo.programSlug ? programIds.get(photo.programSlug) : undefined,
        event: photo.eventSlug ? eventIds.get(photo.eventSlug) : undefined,
        featured: photo.featured ?? false,
      },
      file,
    })
    payload.logger.info(`Created gallery photo: ${photo.title}`)
  }

  // ---- Impact statistics ----
  for (const [index, stat] of IMPACT_STATISTICS.entries()) {
    const existing = await payload.find({
      collection: 'impact-statistics',
      where: { label: { equals: stat.label } },
      limit: 1,
    })
    if (existing.docs[0]) continue
    await payload.create({
      collection: 'impact-statistics',
      data: {
        label: stat.label,
        value: stat.value,
        description: stat.description || undefined,
        sortOrder: index,
        active: true,
      },
    })
    payload.logger.info(`Created impact statistic: ${stat.label}`)
  }

  // ---- Legal document (example, unpublished) ----
  const legalName = 'Akta Pendirian Yayasan (Contoh)'
  const existingLegal = await payload.find({
    collection: 'legal-documents',
    where: { name: { equals: legalName } },
    limit: 1,
  })
  if (!existingLegal.docs[0]) {
    const file = await placeholderFile('akta-pendirian-contoh.jpg', legalName, imageSeed++, {
      width: 900,
      height: 1200,
    })
    await payload.create({
      collection: 'legal-documents',
      data: {
        name: legalName,
        description:
          'Contoh dokumen legalitas. Ganti dengan salinan akta pendirian yayasan yang sebenarnya sebelum dipublikasikan.',
        published: false,
      },
      file,
    })
    payload.logger.info(`Created legal document: ${legalName}`)
  }

  // ---- Home page ----
  await fillGlobalIfEmpty(
    payload,
    'home-page',
    (current) => !(current.hero as Record<string, unknown> | undefined)?.headline,
    async () => ({
      hero: {
        headline: 'Membina, mendidik, dan memberdayakan masyarakat.',
        subheadline:
          'Yayasan Daarul Ummahaat menjalankan program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat.',
        image: await createMediaImage(
          payload,
          'hero-yayasan.jpg',
          'Foto Utama Yayasan (Contoh)',
          imageSeed++,
          {
            width: 1600,
            height: 1000,
          },
        ),
      },
      aboutSummary:
        'Yayasan Daarul Ummahaat adalah yayasan yang bergerak di bidang pendidikan, pembinaan yatim, dan kesejahteraan masyarakat. Sejak berdiri, kami telah membina anak-anak yatim dan dhuafa, serta menyalurkan bantuan pendidikan bagi mahasiswa kurang mampu. (Contoh teks, silakan disesuaikan.)',
    }),
  )

  // ---- Foundation profile ----
  await fillGlobalIfEmpty(
    payload,
    'foundation-profile',
    (current) => !current.vision,
    async () => ({
      profile: richDoc(
        paragraph(
          'Yayasan Daarul Ummahaat adalah yayasan yang bergerak di bidang sosial, pendidikan, dan dakwah. Kami berkomitmen membina anak yatim dan dhuafa, serta memberdayakan masyarakat melalui program pendidikan dan kesejahteraan sosial.',
        ),
        paragraph(
          'Konten ini adalah contoh awal. Silakan admin memperbarui dengan profil yayasan yang sebenarnya.',
        ),
      ),
      history: richDoc(
        paragraph(
          'Yayasan Daarul Ummahaat didirikan atas dasar kepedulian terhadap pendidikan dan kesejahteraan anak yatim serta masyarakat dhuafa di sekitar wilayah operasional yayasan. (Contoh teks, lengkapi dengan sejarah yang sebenarnya.)',
        ),
      ),
      vision:
        'Menjadi yayasan terpercaya yang berperan aktif dalam membina, mendidik, dan memberdayakan umat. (Contoh, silakan disesuaikan.)',
      mission: richDoc(
        bulletList([
          'Menyelenggarakan program pendidikan bagi anak yatim dan dhuafa',
          'Memberikan pembinaan dan santunan rutin bagi anak yatim',
          'Meningkatkan kesejahteraan masyarakat melalui program sosial',
          'Membangun jaringan kemitraan dengan donatur dan masyarakat',
        ]),
      ),
      coreValues: [
        {
          title: 'Amanah',
          description: 'Menjaga kepercayaan donatur dan masyarakat dalam setiap program.',
        },
        { title: 'Ikhlas', description: 'Bekerja dengan niat tulus karena Allah semata.' },
        {
          title: 'Profesional',
          description: 'Mengelola program dan bantuan secara transparan dan bertanggung jawab.',
        },
      ],
      organizationStructure: {
        description: richDoc(
          paragraph(
            'Struktur organisasi yayasan akan ditampilkan di sini. (Contoh, lengkapi dengan struktur yang sebenarnya.)',
          ),
        ),
        // No chart uploaded: a fabricated org chart would be actively misleading, unlike prose an admin visibly edits.
      },
      organizationPhotos: [
        {
          image: await createMediaImage(
            payload,
            'foto-organisasi-1.jpg',
            'Kegiatan Yayasan (Contoh)',
            imageSeed++,
          ),
          caption: 'Kegiatan Yayasan (Contoh)',
        },
        {
          image: await createMediaImage(
            payload,
            'foto-organisasi-2.jpg',
            'Tim Yayasan (Contoh)',
            imageSeed++,
          ),
          caption: 'Tim Yayasan Daarul Ummahaat (Contoh)',
        },
      ],
    }),
  )

  // ---- Donation info ----
  // Every invented value below is clearly marked "(Contoh)" so it is never mistaken for a real
  // account to donate to. Replace all of it with the foundation's real details before publishing.
  await fillGlobalIfEmpty(
    payload,
    'donation-info',
    (current) => !(current.bankAccounts as unknown[])?.length,
    async () => ({
      introduction: richDoc(
        paragraph(
          'Donasi Anda sangat berarti bagi kelangsungan program pendidikan, pembinaan yatim, dan kesejahteraan masyarakat yang kami jalankan.',
        ),
        paragraph(
          'Melalui donasi, Anda turut membantu anak yatim mendapatkan pendidikan yang layak, mahasiswa dhuafa melanjutkan kuliah, serta masyarakat sekitar mendapatkan kesejahteraan yang lebih baik.',
        ),
      ),
      bankAccounts: [
        {
          bankName: 'Bank Contoh Syariah',
          accountNumber: '1234567890',
          accountHolder: 'Yayasan Daarul Ummahaat (Contoh)',
          additionalInfo: 'Ganti dengan rekening resmi yayasan sebelum digunakan.',
        },
      ],
      qris: {
        image: await createMediaImage(payload, 'qris-contoh.jpg', 'QRIS (Contoh)', imageSeed++, {
          width: 900,
          height: 900,
        }),
        additionalInfo:
          'Scan menggunakan aplikasi m-banking atau e-wallet apa pun. Ganti dengan QRIS resmi yayasan.',
      },
      ewallets: [
        {
          provider: 'GoPay (Contoh)',
          accountNumber: '081234567890',
          accountHolder: 'Yayasan Daarul Ummahaat (Contoh)',
        },
      ],
      whatsappConfirmation: { number: '081234567890' },
    }),
  )

  // ---- Contact info ----
  await fillGlobalIfEmpty(
    payload,
    'contact-info',
    (current) => !current.address,
    async () => ({
      address: 'Jl. Contoh Alamat Yayasan No. 1, Jakarta (Ganti dengan alamat sebenarnya)',
      phone: '021 1234 5678',
      whatsapp: '081234567890',
      email: 'info@contoh-yayasan.org',
    }),
  )

  // ---- Site settings ----
  await fillGlobalIfEmpty(
    payload,
    'site-settings',
    (current) => !current.tagline,
    async () => {
      const logoData = readPublicImage('public/brand/logo-emerald.png')
      let logoId: Id | undefined
      if (logoData) {
        const created = await payload.create({
          collection: 'media',
          data: { alt: 'Logo Yayasan Daarul Ummahaat' },
          file: {
            data: logoData,
            mimetype: 'image/png',
            name: 'logo-emerald.png',
            size: logoData.length,
          },
        })
        logoId = created.id as Id
      } else {
        payload.logger.info(
          'logo-emerald.png not found under public/brand/; site settings logo left unset.',
        )
      }
      return {
        tagline: 'Membina, Mendidik, dan Memberdayakan Masyarakat',
        logo: logoId,
        defaultSeo: {
          metaDescription:
            'Yayasan Daarul Ummahaat: membina, mendidik, dan memberdayakan masyarakat melalui program pendidikan, pembinaan yatim, dan kesejahteraan sosial.',
        },
      }
    },
  )
}
