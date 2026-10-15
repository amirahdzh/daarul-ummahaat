import { afterEach, describe, expect, it, vi } from 'vitest'

import { emailAdapter } from '@/lib/email'
import config from '@/payload.config'

describe('admin for non-technical, phone-first users', () => {
  it('shows shortcut buttons above the dashboard', async () => {
    const { admin } = await config
    expect(admin?.components?.beforeDashboard).toEqual([
      './components/admin/QuickActions.tsx#QuickActions',
    ])
  })

  it('keeps only everyday content at the top of the menu', async () => {
    const { collections } = await config
    const group = (slug: string) => {
      const label = collections.find((c) => c.slug === slug)?.admin?.group
      return typeof label === 'object' ? label.id : label
    }
    for (const slug of [
      'program-categories',
      'event-categories',
      'gallery-categories',
      'media',
      'users',
    ]) {
      expect(group(slug), slug).toBe('Lanjutan')
    }
    for (const slug of ['programs', 'events', 'gallery-images']) {
      expect(group(slug), slug).not.toBe('Lanjutan')
    }
  })

  it('keeps the slug out of sight, inside the collapsed "Advanced options" section', async () => {
    const { collections } = await config
    for (const slug of [
      'programs',
      'events',
      'program-categories',
      'event-categories',
      'gallery-categories',
    ]) {
      const fields = collections.find((c) => c.slug === slug)?.fields ?? []
      expect(
        fields.some((f) => 'name' in f && f.name === 'slug'),
        `${slug}: slug is still a top-level field`,
      ).toBe(false)
      const section = fields.find(
        (f) => f.type === 'collapsible' && f.fields.some((x) => 'name' in x && x.name === 'slug'),
      )
      expect(section, `${slug}: no section holds the slug`).toMatchObject({
        admin: { initCollapsed: true },
      })
    }
  })

  it('words the publish buttons in plain Indonesian and English', async () => {
    const { i18n } = await config
    const id = i18n?.translations?.id?.version
    expect(id?.publish).toBe('Tayangkan')
    expect(id?.saveDraft).toBe('Simpan draf')
    expect(i18n?.translations?.en?.version?.saveDraft).toBe('Save draft')
    expect(i18n?.translations?.id?.error?.userLocked).toContain('10 menit')
  })

  it('has Indonesian labels for the rich text editor, so no raw keys show', async () => {
    const { i18n } = await config
    const lexical = (i18n?.translations?.id as { lexical?: Record<string, unknown> } | undefined)
      ?.lexical
    expect(lexical?.general).toMatchObject({ placeholder: expect.stringContaining('menulis') })
    expect(lexical).toHaveProperty('link.label', 'Tautan')
  })

  it('sends the password reset email in Indonesian with a link on the site address', async () => {
    const { collections } = await config
    const users = collections.find((c) => c.slug === 'users')
    const forgot = typeof users?.auth === 'object' ? users.auth.forgotPassword : undefined
    const html = await forgot?.generateEmailHTML?.({
      token: 'abc123',
      req: {} as never,
      user: {} as never,
    })
    expect(html).toContain('/admin/reset/abc123')
    expect(html).toContain('kata sandi')
    expect(await forgot?.generateEmailSubject?.({ req: {} as never, user: {} as never })).toContain(
      'kata sandi',
    )
  })
})

describe('emailAdapter', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('is off without SMTP_HOST, so local emails print to the terminal', () => {
    vi.stubEnv('SMTP_HOST', '')
    expect(emailAdapter()).toBeUndefined()
  })

  it('is on once SMTP settings are present', () => {
    vi.stubEnv('SMTP_HOST', 'smtp.example.org')
    vi.stubEnv('SMTP_USER', 'no-reply@example.org')
    vi.stubEnv('SMTP_PASSWORD', 'secret')
    expect(emailAdapter).not.toThrow()
    expect(emailAdapter()).toBeDefined()
  })
})
