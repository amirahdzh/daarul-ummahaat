import type { Payload } from 'payload'

import { createStarterContent } from './starterContent'

/**
 * Loads the starter categories and initial draft programs (see starterContent.ts) when
 * SEED_STARTER_CONTENT=true, so it can be run once against a live server without a database
 * tunnel: add the variable to .env, restart the app, then remove it again.
 *
 * Safe to run more than once (see createStarterContent), so leaving the variable in place by
 * accident is harmless, just an unnecessary check on every restart.
 */
export const bootstrapStarterContent = async (
  payload: Pick<Payload, 'find' | 'create' | 'findGlobal' | 'updateGlobal' | 'logger'>,
): Promise<void> => {
  if (process.env.SEED_STARTER_CONTENT !== 'true') return

  payload.logger.info('SEED_STARTER_CONTENT is set: loading starter content.')
  try {
    await createStarterContent(payload)
    payload.logger.info('Starter content loaded. Remove SEED_STARTER_CONTENT from .env now.')
  } catch (error) {
    // A bug or bad data here must never prevent the server itself from starting.
    payload.logger.error('Failed to load starter content. The site will still start normally.')
    payload.logger.error(error)
  }
}
