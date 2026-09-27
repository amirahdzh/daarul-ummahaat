/**
 * Loads the starting data listed in docs/requirements.md: categories and the initial programs.
 * Safe to run more than once: anything that already exists (matched by slug) is left alone.
 *
 *   pnpm seed
 *
 * To load the same data into a running production server without a database tunnel, set
 * SEED_STARTER_CONTENT=true in its .env and restart the app instead (see docs/deployment.md).
 */
import { getPayload } from 'payload'

import config from './payload.config'
import { createStarterContent } from './lib/starterContent'

const payload = await getPayload({ config: await config })
await createStarterContent(payload)
payload.logger.info('Seed complete.')
process.exit(0)
