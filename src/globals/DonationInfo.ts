import type { GlobalConfig } from 'payload'

import { whatsappNumberField } from '../fields/whatsapp'

export const DonationInfo: GlobalConfig = {
  slug: 'donation-info',
  label: { en: 'Donation information', id: 'Informasi donasi' },
  admin: { group: { en: 'Site content', id: 'Konten situs' } },
  access: { read: () => true },
  fields: [
    {
      name: 'introduction',
      type: 'richText',
      label: { en: 'Introduction', id: 'Pengantar' },
      admin: {
        description: {
          en: 'The purpose of donating, its impact, and the programs people can support.',
          id: 'Tujuan berdonasi, dampaknya, dan program-program yang dapat didukung.',
        },
      },
    },
    {
      name: 'bankAccounts',
      type: 'array',
      label: { en: 'Bank accounts', id: 'Rekening bank' },
      labels: {
        singular: { en: 'Bank account', id: 'Rekening bank' },
        plural: { en: 'Bank accounts', id: 'Rekening bank' },
      },
      fields: [
        {
          name: 'bankName',
          type: 'text',
          required: true,
          label: { en: 'Bank name', id: 'Nama bank' },
        },
        {
          name: 'accountNumber',
          type: 'text',
          required: true,
          label: { en: 'Account number', id: 'Nomor rekening' },
        },
        {
          name: 'accountHolder',
          type: 'text',
          required: true,
          label: { en: 'Account holder', id: 'Atas nama' },
        },
        {
          name: 'qrImage',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'QR image', id: 'Gambar QR' },
        },
        {
          name: 'additionalInfo',
          type: 'textarea',
          label: { en: 'Additional information', id: 'Informasi tambahan' },
        },
      ],
    },
    {
      name: 'qris',
      type: 'group',
      label: { en: 'QRIS', id: 'QRIS' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'QRIS image', id: 'Gambar QRIS' },
        },
        {
          name: 'additionalInfo',
          type: 'textarea',
          label: { en: 'Additional information', id: 'Informasi tambahan' },
        },
      ],
    },
    {
      name: 'ewallets',
      type: 'array',
      label: { en: 'E-wallets', id: 'Dompet digital' },
      labels: {
        singular: { en: 'E-wallet', id: 'Dompet digital' },
        plural: { en: 'E-wallets', id: 'Dompet digital' },
      },
      fields: [
        {
          name: 'provider',
          type: 'text',
          required: true,
          label: { en: 'Provider', id: 'Penyedia' },
          admin: {
            description: { en: 'For example: GoPay, OVO, DANA.', id: 'Misalnya: GoPay, OVO, DANA.' },
          },
        },
        {
          name: 'accountNumber',
          type: 'text',
          required: true,
          label: { en: 'Number or ID', id: 'Nomor atau ID' },
        },
        {
          name: 'accountHolder',
          type: 'text',
          label: { en: 'Account holder', id: 'Atas nama' },
        },
        {
          name: 'qrImage',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'QR image', id: 'Gambar QR' },
        },
        {
          name: 'additionalInfo',
          type: 'textarea',
          label: { en: 'Additional information', id: 'Informasi tambahan' },
        },
      ],
    },
    {
      name: 'whatsappConfirmation',
      type: 'group',
      label: { en: 'WhatsApp confirmation', id: 'Konfirmasi WhatsApp' },
      fields: [
        whatsappNumberField({
          name: 'number',
          label: { en: 'WhatsApp number', id: 'Nomor WhatsApp' },
          admin: {
            description: {
              en: 'Where donors send their confirmation. Type it any way you like, for example 0812 3456 7890.',
              id: 'Nomor tujuan konfirmasi donatur. Ketik dengan cara apa pun, misalnya 0812 3456 7890.',
            },
          },
        }),
        {
          name: 'message',
          type: 'textarea',
          label: { en: 'Ready-made message', id: 'Pesan siap pakai' },
          defaultValue: "Assalamu'alaikum, saya telah berdonasi. Berikut bukti transfer saya.",
          admin: {
            description: {
              en: 'The message that opens in WhatsApp for the donor to send.',
              id: 'Pesan yang terbuka di WhatsApp untuk dikirim oleh donatur.',
            },
          },
        },
      ],
    },
  ],
}
