import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Where uploaded files live on disk. Set MEDIA_DIR in production to a persistent volume.
 * Each upload collection gets its own sub-folder.
 */
export const mediaDir = (collectionSlug: string): string =>
  path.resolve(process.env.MEDIA_DIR ?? path.resolve(dirname, '../../media'), collectionSlug)
