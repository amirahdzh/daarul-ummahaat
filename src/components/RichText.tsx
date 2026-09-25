import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Data = { root?: { children?: unknown[] } } | null | undefined

/** True when the editor holds real content, not just an empty paragraph. */
export const hasRichText = (data: Data): boolean => {
  const children = data?.root?.children
  if (!Array.isArray(children) || children.length === 0) return false
  if (children.length > 1) return true
  const only = children[0] as { type?: string; children?: unknown[] }
  return !(only.type === 'paragraph' && (only.children?.length ?? 0) === 0)
}

export function RichText({ data, className = 'prose' }: { data: Data; className?: string }) {
  if (!hasRichText(data)) return null
  return <LexicalRichText data={data as unknown as SerializedEditorState} className={className} />
}
