import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import config from '@/payload.config'

let visitorIp = '10.0.0.1'
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': visitorIp }),
}))

// Imported after the mock so the action sees the fake headers().
const { sendContactMessage } = await import('@/app/(frontend)/contact/actions')

const idle = { status: 'idle' } as const

const form = (fields: Record<string, string> = {}) => {
  const data = new FormData()
  const defaults: Record<string, string> = {
    name: 'Siti Rahma',
    email: 'siti@example.com',
    whatsapp: '0812 3456 7890',
    message: 'Saya ingin menanyakan program beasiswa kuliah.',
    website: '',
    startedAt: String(Date.now() - 30_000),
  }
  for (const [key, value] of Object.entries({ ...defaults, ...fields })) data.set(key, value)
  return data
}

describe('contact form action', () => {
  let payload: Payload
  let sendEmail: ReturnType<typeof vi.spyOn>
  let originalEmail: string | null | undefined
  let counter = 0

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    originalEmail = (await payload.findGlobal({ slug: 'contact-info' })).email
    await payload.updateGlobal({ slug: 'contact-info', data: { email: 'penerima@example.org' } })
  })

  afterAll(async () => {
    await payload.updateGlobal({ slug: 'contact-info', data: { email: originalEmail ?? null } })
  })

  beforeEach(() => {
    // A fresh visitor each test, so the rate limit never carries over.
    visitorIp = `10.0.1.${++counter}`
    sendEmail = vi.spyOn(payload, 'sendEmail')
    sendEmail.mockReset()
    sendEmail.mockResolvedValue(undefined as never)
  })

  it('emails the foundation and shows a success message', async () => {
    const state = await sendContactMessage(idle, form())
    expect(state.status).toBe('success')
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const mail = sendEmail.mock.calls[0][0] as {
      to: string
      replyTo: string
      subject: string
      text: string
    }
    expect(mail.to).toBe('penerima@example.org')
    expect(mail.replyTo).toBe('siti@example.com')
    expect(mail.subject).toContain('Siti Rahma')
    expect(mail.text).toContain('6281234567890')
    expect(mail.text).toContain('program beasiswa')
  })

  it('shows field errors in Indonesian and keeps what was typed', async () => {
    const state = await sendContactMessage(idle, form({ email: 'salah', message: 'pendek' }))
    expect(state.status).toBe('error')
    expect(state.errors?.email).toBeTruthy()
    expect(state.errors?.message).toBeTruthy()
    expect(state.values?.name).toBe('Siti Rahma')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('pretends success to bots but sends nothing', async () => {
    const honeypot = await sendContactMessage(idle, form({ website: 'http://spam.example' }))
    const instant = await sendContactMessage(idle, form({ startedAt: String(Date.now()) }))
    expect(honeypot.status).toBe('success')
    expect(instant.status).toBe('success')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('limits each visitor to five messages per window', async () => {
    for (let i = 0; i < 5; i++)
      expect((await sendContactMessage(idle, form())).status).toBe('success')
    const sixth = await sendContactMessage(idle, form())
    expect(sixth.status).toBe('error')
    expect(sendEmail).toHaveBeenCalledTimes(5)
  })

  it('shows an error, not a false success, when sending fails', async () => {
    sendEmail.mockRejectedValueOnce(new Error('SMTP down'))
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const state = await sendContactMessage(idle, form())
    expect(state.status).toBe('error')
    expect(state.message).toContain('WhatsApp')
    errorLog.mockRestore()
  })

  it('reports a configuration problem when there is nowhere to send', async () => {
    await payload.updateGlobal({ slug: 'contact-info', data: { email: null } })
    const previous = process.env.CONTACT_TO_EMAIL
    delete process.env.CONTACT_TO_EMAIL
    try {
      const state = await sendContactMessage(idle, form())
      expect(state.status).toBe('error')
      expect(sendEmail).not.toHaveBeenCalled()
    } finally {
      if (previous) process.env.CONTACT_TO_EMAIL = previous
      await payload.updateGlobal({ slug: 'contact-info', data: { email: 'penerima@example.org' } })
    }
  })
})
