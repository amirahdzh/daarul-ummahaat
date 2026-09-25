import type { Payload } from 'payload'

const MIN_PASSWORD_LENGTH = 12

/**
 * Creates the first administrator from INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD, but only when
 * no user exists yet. This avoids leaving the "create first user" page open on a public server
 * between the first deploy and the first visit.
 *
 * Remove both variables from the server's .env after the first successful login.
 */
export const bootstrapAdmin = async (
  payload: Pick<Payload, 'count' | 'create' | 'logger'>,
): Promise<void> => {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim()
  const password = process.env.INITIAL_ADMIN_PASSWORD
  if (!email || !password) return

  if (password.length < MIN_PASSWORD_LENGTH) {
    payload.logger.error(
      `INITIAL_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters. No admin was created.`,
    )
    return
  }

  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs > 0) return

  await payload.create({ collection: 'users', data: { email, password } })
  payload.logger.info(
    `Created the first administrator (${email}). Remove INITIAL_ADMIN_* from .env now.`,
  )
}
