import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

/**
 * Outgoing mail (contact form messages and admin password resets) over SMTP.
 *
 * Returns nothing when SMTP_HOST is not set, so local development keeps Payload's default of
 * printing emails to the terminal. In production, set SMTP_HOST, SMTP_USER and SMTP_PASSWORD
 * (see docs/deployment.md).
 */
export const emailAdapter = () => {
  const host = process.env.SMTP_HOST?.trim()
  if (!host) return undefined

  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER?.trim()
  const fromAddress = process.env.EMAIL_FROM?.trim() || user || 'no-reply@localhost'

  return nodemailerAdapter({
    defaultFromAddress: fromAddress,
    defaultFromName: 'Yayasan Daarul Ummahaat',
    transportOptions: {
      host,
      port,
      // Port 465 uses TLS from the start; 587 upgrades with STARTTLS.
      secure: port === 465,
      ...(user ? { auth: { user, pass: process.env.SMTP_PASSWORD ?? '' } } : {}),
    },
  })
}
