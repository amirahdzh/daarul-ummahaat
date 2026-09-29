import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * A deliberately small toolbar for non-technical admins: paragraphs, two heading sizes (H1/H2
 * are reserved for the page title, set elsewhere), bold, italic, links, lists and quotes.
 * A fixed toolbar (always visible) is easier to discover than the default's floating selection
 * toolbar. Used as the site-wide default editor in payload.config.ts.
 */
export const richText = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    FixedToolbarFeature(),
  ],
})
