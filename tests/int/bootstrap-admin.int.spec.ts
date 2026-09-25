import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { bootstrapAdmin } from '@/lib/bootstrapAdmin'

const fakePayload = (existingUsers: number) => {
  const count = vi.fn().mockResolvedValue({ totalDocs: existingUsers })
  const create = vi.fn().mockResolvedValue({ id: 1 })
  const logger = { info: vi.fn(), error: vi.fn() }
  return { payload: { count, create, logger } as never, count, create, logger }
}

describe('bootstrapAdmin', () => {
  const original = {
    email: process.env.INITIAL_ADMIN_EMAIL,
    password: process.env.INITIAL_ADMIN_PASSWORD,
  }

  beforeEach(() => {
    delete process.env.INITIAL_ADMIN_EMAIL
    delete process.env.INITIAL_ADMIN_PASSWORD
  })

  afterEach(() => {
    if (original.email) process.env.INITIAL_ADMIN_EMAIL = original.email
    if (original.password) process.env.INITIAL_ADMIN_PASSWORD = original.password
  })

  it('does nothing when the variables are not set', async () => {
    const { payload, count, create } = fakePayload(0)
    await bootstrapAdmin(payload)
    expect(count).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it('creates the first administrator when there are no users', async () => {
    process.env.INITIAL_ADMIN_EMAIL = ' admin@example.org '
    process.env.INITIAL_ADMIN_PASSWORD = 'a-long-enough-password'
    const { payload, create } = fakePayload(0)
    await bootstrapAdmin(payload)
    expect(create).toHaveBeenCalledWith({
      collection: 'users',
      data: { email: 'admin@example.org', password: 'a-long-enough-password' },
    })
  })

  it('never creates a second account once a user exists', async () => {
    process.env.INITIAL_ADMIN_EMAIL = 'admin@example.org'
    process.env.INITIAL_ADMIN_PASSWORD = 'a-long-enough-password'
    const { payload, create } = fakePayload(1)
    await bootstrapAdmin(payload)
    expect(create).not.toHaveBeenCalled()
  })

  it('refuses a short password and says why', async () => {
    process.env.INITIAL_ADMIN_EMAIL = 'admin@example.org'
    process.env.INITIAL_ADMIN_PASSWORD = 'short'
    const { payload, create, logger } = fakePayload(0)
    await bootstrapAdmin(payload)
    expect(create).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('at least 12'))
  })
})
