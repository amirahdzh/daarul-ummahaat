import { test, expect, Page } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

// The admin is meant to be usable on a phone by someone non-technical. These checks open the
// screens an admin uses most at phone width and fail if the page scrolls sideways.
const SCREENS = [
  { name: 'dashboard', path: '/admin' },
  { name: 'event-new', path: '/admin/collections/events/create' },
  { name: 'program-new', path: '/admin/collections/programs/create' },
  { name: 'gallery-new', path: '/admin/collections/gallery-images/create' },
  { name: 'events-list', path: '/admin/collections/events' },
  { name: 'donation-info', path: '/admin/globals/donation-info' },
  { name: 'contact-info', path: '/admin/globals/contact-info' },
  { name: 'site-settings', path: '/admin/globals/site-settings' },
]

test.describe('Admin on a phone', () => {
  let page: Page
  let eventId: number | string | undefined

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    const payload = await getPayload({ config })
    const event = await payload.create({
      collection: 'events',
      data: {
        name: 'Tes tampilan HP (hapus)',
        eventDate: '2027-03-14T00:00:00.000Z',
      },
      draft: true,
    })
    eventId = event.id
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      locale: 'id-ID',
    })
    page = await context.newPage()
    // Not the shared login helper: it looks for the English word "Dashboard" in the side menu,
    // which is Indonesian here and folded away on a phone.
    await page.goto('http://localhost:3000/admin/login')
    await page.fill('#field-email', testUser.email)
    await page.fill('#field-password', testUser.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/admin')
  })

  test.afterAll(async () => {
    if (eventId !== undefined) {
      const payload = await getPayload({ config })
      await payload.delete({ collection: 'events', id: eventId }).catch(() => undefined)
    }
    await cleanupTestUser()
  })

  test('the home screen offers big shortcut buttons', async () => {
    await page.goto('http://localhost:3000/admin')
    for (const label of ['Tambah acara', 'Tambah program', 'Unggah foto galeri']) {
      const button = page.getByRole('link', { name: label })
      await expect(button).toBeVisible()
      const box = await button.boundingBox()
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    }
  })

  test('the new-event form words the buttons plainly', async () => {
    await page.goto('http://localhost:3000/admin/collections/events/create')
    await expect(page.getByRole('button', { name: /Simpan draf/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Tayangkan/ })).toBeVisible()
    // The slug is an address detail most admins never need: hidden until "Opsi lanjutan" opens.
    await expect(page.getByLabel('Slug')).toBeHidden()
    await page.locator('.collapsible__toggle').first().click()
    await expect(page.getByLabel('Slug')).toBeVisible()
  })

  test('a saved event offers an add button for photos, a new one does not', async () => {
    await page.goto('http://localhost:3000/admin/collections/events/create')
    await expect(page.getByRole('heading', { name: 'Galeri', exact: true })).toHaveCount(0)

    await page.goto(`http://localhost:3000/admin/collections/events/${eventId}`)
    await expect(page.getByRole('heading', { name: 'Galeri', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /Tambah .* baru/ }).last()).toBeVisible()
    if (process.env.ADMIN_SCREENSHOT_DIR) {
      await page.screenshot({
        path: `${process.env.ADMIN_SCREENSHOT_DIR}/event-saved.png`,
        fullPage: true,
      })
    }
  })

  for (const screen of SCREENS) {
    test(`${screen.name} fits a 390px screen`, async () => {
      await page.goto(`http://localhost:3000${screen.path}`)
      await page.waitForLoadState('networkidle')
      // Set ADMIN_SCREENSHOT_DIR to keep a picture of each screen for a visual check.
      if (process.env.ADMIN_SCREENSHOT_DIR) {
        await page.screenshot({
          path: `${process.env.ADMIN_SCREENSHOT_DIR}/${screen.name}.png`,
          fullPage: true,
        })
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${screen.path} scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(0)
    })
  }
})
