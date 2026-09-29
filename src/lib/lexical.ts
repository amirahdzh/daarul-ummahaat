/**
 * Minimal builders for Payload's Lexical richText JSON, for writing rich text from a script
 * (seeding, imports) instead of the admin editor. Deliberately covers only what the starter
 * content needs: paragraphs, one heading level and bullet lists (matching the toolbar in
 * src/lib/richText.ts).
 */

// `type`/`version` are kept as concrete types (string/number), not swallowed into the index
// signature, so this structurally matches Payload's generated richText field types, which
// require exactly `{ [k: string]: unknown; type: any; version: number }` on each node.
type LexicalNode = { type: string; version: number; [key: string]: unknown }

const text = (value: string) => ({
  type: 'text',
  text: value,
  version: 1,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
})

export const paragraph = (value: string): LexicalNode => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: [text(value)],
})

export const heading = (value: string): LexicalNode => ({
  type: 'heading',
  tag: 'h3',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: [text(value)],
})

const listItem = (value: string, index: number): LexicalNode => ({
  type: 'listitem',
  value: index + 1,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: [text(value)],
})

export const bulletList = (items: string[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: items.map(listItem),
})

/** A full Lexical document ready for a `richText` field, from paragraph/heading/list nodes. */
export const richDoc = (...children: LexicalNode[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children,
  },
})
