import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { isSafePreviewPath, previewSecret } from '@/lib/preview'

/**
 * Only ever followed from an authenticated admin's "Preview" button in the admin (see
 * lib/preview.ts and the `admin.preview` option on the Programs and Events collections).
 * Enables Next.js draft mode, so the target page fetches the draft instead of the published
 * version, then redirects there.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')

  if (secret !== previewSecret()) {
    return new Response('Invalid preview secret', { status: 401 })
  }
  if (!isSafePreviewPath(path)) {
    return new Response('Invalid path', { status: 400 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
