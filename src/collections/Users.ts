import type { CollectionConfig } from 'payload'

import { siteUrl } from '../lib/site'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'Admin user', id: 'Pengguna admin' },
    plural: { en: 'Admin users', id: 'Pengguna admin' },
  },
  admin: {
    group: { en: 'Advanced', id: 'Lanjutan' },
    useAsTitle: 'email',
  },
  auth: {
    // Lock an account for 10 minutes after 5 wrong passwords.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    // Stay signed in for 7 days.
    tokenExpiration: 7 * 24 * 60 * 60,
    // Reset email in Indonesian, with a plain link and no jargon. Admins reach it from "Lupa kata sandi".
    forgotPassword: {
      generateEmailSubject: () => 'Atur ulang kata sandi admin Yayasan Daarul Ummahaat',
      generateEmailHTML: (args) => {
        const link = `${siteUrl()}/admin/reset/${args?.token ?? ''}`
        return `<p>Assalamu'alaikum,</p>
<p>Kami menerima permintaan untuk mengatur ulang kata sandi admin website Yayasan Daarul Ummahaat.</p>
<p><a href="${link}">Klik di sini untuk membuat kata sandi baru</a></p>
<p>Jika tombol tidak berfungsi, salin alamat ini ke browser Anda:<br>${link}</p>
<p>Jika Anda tidak merasa meminta ini, abaikan saja email ini. Kata sandi Anda tidak berubah.</p>`
      },
    },
    cookies: {
      // Browsers only send the login cookie over HTTPS in production.
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  fields: [
    // Email added by default
  ],
}
