/**
 * Admin panel wording that Payload's own translations get wrong or lack for our admins.
 * Wired into `i18n.translations` in payload.config.ts.
 *
 * - Publish buttons: "Draft" and "Publish" mean little to someone who only wants to know whether
 *   visitors can see the page yet. Kept short on purpose: on a phone two longer buttons side by
 *   side no longer fit the screen.
 * - Lock-out message: says how long to wait and what else to do.
 * - Rich text editor: Payload has no Indonesian pack for it, so its labels showed as raw keys
 *   such as "lexical:general:placeholder".
 */
export const adminTranslations = {
  id: {
    version: {
      draft: 'Draf (belum tayang)',
      draftHasPublishedVersion: 'Draf (versi lama masih tayang)',
      publish: 'Tayangkan',
      publishChanges: 'Tayangkan',
      published: 'Sedang tayang',
      saveDraft: 'Simpan draf',
      unpublish: 'Sembunyikan',
      unpublished: 'Belum tayang',
    },
    error: {
      userLocked:
        'Akun terkunci sementara karena terlalu banyak percobaan masuk yang salah. Coba lagi dalam 10 menit, atau gunakan "Lupa kata sandi".',
    },
    lexical: {
      general: {
        placeholder: "Mulai menulis, atau tekan '/' untuk perintah...",
        slashMenuBasicGroupLabel: 'Dasar',
        slashMenuListGroupLabel: 'Daftar',
        toolbarItemsActive: '{{count}} aktif',
      },
      paragraph: { label: 'Paragraf', label2: 'Teks biasa' },
      heading: { label: 'Judul {{headingLevel}}' },
      blockquote: { label: 'Kutipan' },
      link: { label: 'Tautan', loadingWithEllipsis: 'Memuat...' },
      orderedList: { label: 'Daftar bernomor' },
      unorderedList: { label: 'Daftar berpoin' },
      checklist: { label: 'Daftar centang' },
    },
  },
  en: {
    version: {
      draft: 'Draft (not live yet)',
      draftHasPublishedVersion: 'Draft (older version still live)',
      published: 'Live',
      saveDraft: 'Save draft',
      unpublished: 'Not live',
    },
    error: {
      userLocked:
        'This account is temporarily locked after too many wrong sign-in attempts. Try again in 10 minutes, or use "Forgot password".',
    },
  },
}
