import type { GlobalConfig } from 'payload'

import { whatsappNumberField } from '../fields/whatsapp'

export const DonationInfo: GlobalConfig = {
  slug: 'donation-info',
  label: 'Donation information',
  admin: { group: 'Site content' },
  access: { read: () => true },
  fields: [
    {
      name: 'introduction',
      type: 'richText',
      admin: {
        description: 'The purpose of donating, its impact, and the programs people can support.',
      },
    },
    {
      name: 'bankAccounts',
      type: 'array',
      label: 'Bank accounts',
      labels: { singular: 'Bank account', plural: 'Bank accounts' },
      fields: [
        { name: 'bankName', type: 'text', required: true },
        { name: 'accountNumber', type: 'text', required: true },
        { name: 'accountHolder', type: 'text', required: true },
        { name: 'qrImage', type: 'upload', relationTo: 'media', label: 'QR image' },
        { name: 'additionalInfo', type: 'textarea' },
      ],
    },
    {
      name: 'qris',
      type: 'group',
      label: 'QRIS',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'QRIS image' },
        { name: 'additionalInfo', type: 'textarea' },
      ],
    },
    {
      name: 'ewallets',
      type: 'array',
      label: 'E-wallets',
      labels: { singular: 'E-wallet', plural: 'E-wallets' },
      fields: [
        {
          name: 'provider',
          type: 'text',
          required: true,
          admin: { description: 'For example: GoPay, OVO, DANA.' },
        },
        { name: 'accountNumber', type: 'text', required: true, label: 'Number or ID' },
        { name: 'accountHolder', type: 'text' },
        { name: 'qrImage', type: 'upload', relationTo: 'media', label: 'QR image' },
        { name: 'additionalInfo', type: 'textarea' },
      ],
    },
    {
      name: 'whatsappConfirmation',
      type: 'group',
      label: 'WhatsApp confirmation',
      fields: [
        whatsappNumberField({
          name: 'number',
          label: 'WhatsApp number',
          admin: {
            description:
              'Where donors send their confirmation. Type it any way you like, for example 0812 3456 7890.',
          },
        }),
        {
          name: 'message',
          type: 'textarea',
          label: 'Ready-made message',
          defaultValue: "Assalamu'alaikum, saya telah berdonasi. Berikut bukti transfer saya.",
          admin: { description: 'The message that opens in WhatsApp for the donor to send.' },
        },
      ],
    },
  ],
}
