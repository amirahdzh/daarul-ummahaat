import type { ServerProps } from 'payload'

/**
 * The first thing an admin sees after signing in: the handful of things most people come to do,
 * as large buttons that work with a thumb. Shown above Payload's own list of collections, which
 * stays available underneath. Registered in payload.config.ts (`admin.components.beforeDashboard`).
 */

const STRINGS = {
  id: {
    title: 'Mau melakukan apa hari ini?',
    actions: [
      { href: '/admin/collections/events/create', label: 'Tambah acara' },
      { href: '/admin/collections/programs/create', label: 'Tambah program' },
      { href: '/admin/collections/gallery-images/create', label: 'Unggah foto galeri' },
      { href: '/admin/globals/donation-info', label: 'Ubah info donasi' },
      { href: '/admin/globals/contact-info', label: 'Ubah kontak' },
    ],
    viewSite: 'Lihat website',
    tipTitle: 'Cara kerja tayang di website',
    tip: 'Acara dan program yang masih draf belum terlihat oleh pengunjung. Setelah selesai mengisi, tekan "Tayangkan". Untuk menambahkan foto ke acara atau program, simpan dulu, lalu gunakan tombol tambah di bagian Galeri.',
    more: 'Semua konten',
  },
  en: {
    title: 'What would you like to do today?',
    actions: [
      { href: '/admin/collections/events/create', label: 'Add an event' },
      { href: '/admin/collections/programs/create', label: 'Add a program' },
      { href: '/admin/collections/gallery-images/create', label: 'Upload gallery photos' },
      { href: '/admin/globals/donation-info', label: 'Edit donation info' },
      { href: '/admin/globals/contact-info', label: 'Edit contact details' },
    ],
    viewSite: 'View the website',
    tipTitle: 'How publishing works',
    tip: 'Drafts are not visible to visitors. When you are done, press "Publish". To add photos to an event or program, save it first, then use the add button in the Gallery section.',
    more: 'All content',
  },
}

export function QuickActions({ i18n }: ServerProps) {
  const text = i18n?.language === 'en' ? STRINGS.en : STRINGS.id
  return (
    <section className="quick-actions" aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="quick-actions__title">
        {text.title}
      </h2>
      <ul className="quick-actions__list">
        {text.actions.map((action) => (
          <li key={action.href}>
            <a className="quick-actions__button" href={action.href}>
              {action.label}
            </a>
          </li>
        ))}
        <li>
          <a
            className="quick-actions__button quick-actions__button--quiet"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            {text.viewSite}
          </a>
        </li>
      </ul>
      <div className="quick-actions__tip">
        <strong>{text.tipTitle}</strong>
        <p>{text.tip}</p>
      </div>
      <h3 className="quick-actions__more">{text.more}</h3>
    </section>
  )
}
