# Design Language — Yayasan Daarul Ummahaat

**Status:** Agreed as a starting point (2026-09-26). Draft 0.1.
**Visual reference:** design canvas (private): https://claude.ai/artifact/44m6smpD3Kq6v6WAneucgp
It contains foundations, components, and desktop and mobile home mockups. The canvas is the illustration; this document is the source of truth for the tokens.

## Principles

1. **Clean, not lavish.** A charitable foundation should feel welcoming and modest: white space, real photography, no glossy effects.
2. **Clear for donors.** Amber is reserved for donating, so the most important action is never in doubt.
3. **Light and readable.** Generous type, high contrast, few decorations. Must be fast on a mid-range phone over mobile data.

## Colour

The brand colour is taken directly from `logo.png`, which is one flat green. About 81% of its opaque pixels are `#007150`.

| Token | Hex | Use |
|---|---|---|
| White | `#FFFFFF` | Page ground, cards, inputs |
| Mist | `#EAF2EE` | Alternate sections, image placeholders |
| Emerald | `#007150` | Brand and primary: buttons, links, accents. Also the success colour |
| Deep Emerald | `#00402E` | Impact band, footer, hover, dark sections, buttons placed on amber |
| Amber | `#E8A93A` | Donate actions only. Ink text on top |
| Ink | `#17251F` | Body text |
| Muted | `#4F5F58` | Secondary text |
| Mint | `#DAF1EB` | Category chips |
| Line | `#D5DFDA` | Dividers and card borders |
| Input border | `#7D8C85` | Form field borders |
| Amber Text | `#8F5210` | Amber-toned text on light grounds |
| Amber Tint | `#F7E3B8` | Seasonal status background |
| Error | `#B3402A` | Errors |
| Light mint (on dark) | `#B4DCCD` | Secondary text on Deep Emerald |

### Contrast (computed, WCAG 2.x)

| Pair | Ratio |
|---|---|
| Ink on White | 15.9:1 |
| Muted on White | 6.8:1 |
| White on Emerald | 6.0:1 |
| White on Deep Emerald | 11.9:1 |
| Ink on Amber | 7.7:1 |
| Amber on Deep Emerald | 5.7:1 |
| Amber Text on White | 6.2:1 |
| Emerald on Mist | 5.3:1 |
| Emerald on Mint | 5.1:1 |
| Error on White | 5.7:1 |
| Input border on White | 3.5:1 |

Rules:

- Amber is a fill, never text on white (2.1:1). Use Amber Text on light grounds.
- Emerald never sits directly on amber (2.9:1). Buttons on an amber panel use Deep Emerald.
- Colours that must be told apart also differ in lightness, not hue alone.

## Typography

| Role | Face | Weights |
|---|---|---|
| Headings, numbers | Fraunces | 500, 600 |
| Body, navigation, buttons, forms | Plus Jakarta Sans | 400, 500, 600, 700 |

| Style | Face | Size / line height | Notes |
|---|---|---|---|
| Heading 1 | Fraunces 600 | 64 / 68 | letter-spacing -0.02em |
| Heading 2 | Fraunces 600 | 40 / 46 | letter-spacing -0.01em |
| Heading 3 | Fraunces 600 | 24 / 30 | |
| Body | Jakarta 400 | 17 / 28 | |
| Small | Jakarta 500 | 14 / 20 | |
| Eyebrow | Jakarta 700 | 13 / 16 | uppercase, letter-spacing +0.12em |

Mobile scales headings down (H1 38 / 42, H2 32 / 38).

## Shape, motif and space

- **Radius:** 12 for buttons and inputs, 16 for cards, 28 for feature panels, 999 for chips and pills.
- **Arch frame:** photos of people and activities use a round arch (top radius is half the width) with an offset 2px Emerald outline. This is a proposal that may be revisited; the logo's own dome is a pointed onion shape.
- **Star motif:** eight-point star line pattern at 8 to 16% opacity, only behind image placeholders, the impact band and the donate panel.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 72, 96.
- **Depth:** cards use a 1px Line border and no shadow. Raised layers only: `0 8px 24px rgba(0, 113, 80, 0.10)`.
- **Focus:** 2px Deep Emerald outline with a 3px offset.
- **Touch targets:** at least 44px.

## Logo

- Source: `logo.png` in the repository root. It is a single flat green on a transparent background. The transparent pixels contain a stray dark glow in their RGB values, so use only the opaque pixels (alpha) when recolouring.
- **Emerald version** for white and light grounds. **White version** for Deep Emerald and other dark grounds.
- **Emblem only** (dome and book, without the wordmark) is used in headers next to the site name set in live text.
- The wordmark's decorative lettering can read as "Daarut" at small sizes because the "l" resembles a "t". Worth confirming with whoever made the logo.
- A vector source (SVG or the original design file) is needed for large uses. The cleaned copies were made from the 1024px raster and will soften if scaled up.

## Copy conventions

- Interface copy is Indonesian (Beranda, Tentang, Program, Acara, Galeri, Kontak, Donasi). URLs stay English as in the requirements (`/programs`, `/events`).
- Missing content is shown as a bracketed placeholder, for example `[Nama acara]`, never invented.
- The impact figures in the mockups (100+, 50+, 30+, 1000+) are the examples from `docs/requirements.md`, not real data.

## Open questions

- Whether the star motif and arch frames stay alongside the logo, which already has a dome, a book and calligraphy.
- Whether the Mist band and the amber donate panel are the right strength against white.
- Where the final tagline and hero photo come from.
