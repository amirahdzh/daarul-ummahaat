import type { Access } from 'payload'

/** Any signed-in user. Only administrators have accounts, so this means "admin". */
export const isAdmin: Access = ({ req }) => Boolean(req.user)

/** Public visitors see published documents only. Signed-in admins see everything, including drafts. */
export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Public visitors see documents whose checkbox `field` is ticked. Admins see everything. */
export const flagOrAdmin =
  (field: string): Access =>
  ({ req }) => {
    if (req.user) return true
    return { [field]: { equals: true } }
  }
