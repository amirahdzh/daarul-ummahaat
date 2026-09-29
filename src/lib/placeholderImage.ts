import sharp from 'sharp'

/**
 * Generates a simple labelled placeholder photo, for the starter content seed only: no real
 * photos exist yet, and this makes clear in the image itself that it is a stand-in. Uses sharp
 * (already a dependency, for Payload's own image resizing), so no new dependency is needed.
 */

const PALETTE: [string, string][] = [
  ['#00402e', '#e8a93a'],
  ['#007150', '#f7e3b8'],
  ['#0e3b2f', '#daf1eb'],
  ['#8f5210', '#eaf2ee'],
  ['#1f6b43', '#f6d9a0'],
  ['#2b5d7a', '#dbe4f7'],
]

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const placeholderSvg = (label: string, seed: number, width: number, height: number): string => {
  const [background, accent] = PALETTE[seed % PALETTE.length]
  const cx = 120 + ((seed * 97) % Math.max(1, width - 240))
  const cy = 100 + ((seed * 53) % Math.max(1, height - 200))
  const radius = 90 + ((seed * 31) % 80)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${background}"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${accent}" opacity="0.55"/>
    <text x="32" y="${height - 32}" font-family="sans-serif" font-size="26" fill="#ffffff" opacity="0.9">${escapeXml(label)}</text>
  </svg>`
}

/** A Payload upload `file` object: a generated JPEG carrying `label` as visible text. */
export const placeholderFile = async (
  filename: string,
  label: string,
  seed: number,
  { width = 1200, height = 800 }: { width?: number; height?: number } = {},
): Promise<{ data: Buffer; mimetype: string; name: string; size: number }> => {
  const data = await sharp(Buffer.from(placeholderSvg(label, seed, width, height)))
    .jpeg({ quality: 82 })
    .toBuffer()
  return { data, mimetype: 'image/jpeg', name: filename, size: data.length }
}
