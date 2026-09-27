import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/starterContent', () => ({ createStarterContent: vi.fn() }))

const { createStarterContent } = await import('@/lib/starterContent')
const { bootstrapStarterContent } = await import('@/lib/bootstrapStarterContent')

const fakePayload = () => ({ logger: { info: vi.fn(), error: vi.fn() } }) as never

describe('bootstrapStarterContent', () => {
  const original = process.env.SEED_STARTER_CONTENT

  beforeEach(() => {
    delete process.env.SEED_STARTER_CONTENT
    vi.mocked(createStarterContent).mockClear()
  })

  afterEach(() => {
    if (original) process.env.SEED_STARTER_CONTENT = original
  })

  it('does nothing when the variable is not set', async () => {
    await bootstrapStarterContent(fakePayload())
    expect(createStarterContent).not.toHaveBeenCalled()
  })

  it('does nothing for values other than exactly "true"', async () => {
    for (const value of ['1', 'yes', 'TRUE', ' true ']) {
      process.env.SEED_STARTER_CONTENT = value
      await bootstrapStarterContent(fakePayload())
    }
    expect(createStarterContent).not.toHaveBeenCalled()
  })

  it('loads the starter content when set to "true"', async () => {
    process.env.SEED_STARTER_CONTENT = 'true'
    const payload = fakePayload()
    await bootstrapStarterContent(payload)
    expect(createStarterContent).toHaveBeenCalledWith(payload)
    expect(createStarterContent).toHaveBeenCalledTimes(1)
  })
})
