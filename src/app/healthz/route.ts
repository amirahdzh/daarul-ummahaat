import config from '@payload-config'
import { getPayload } from 'payload'

// Used by Docker's health check and the deploy script. Never cache it.
export const dynamic = 'force-dynamic'

/** 200 when the app is up and can reach the database, 503 otherwise. */
export async function GET() {
  try {
    const payload = await getPayload({ config: await config })
    await payload.count({ collection: 'users' })
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json(
      { status: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
