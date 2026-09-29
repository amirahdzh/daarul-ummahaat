import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { isSafePreviewPath } from '@/lib/preview'

/** Turns off draft mode. Linked from the draft banner shown on a previewed page. */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')
  const draft = await draftMode()
  draft.disable()
  redirect(isSafePreviewPath(path) ? path : '/')
}
