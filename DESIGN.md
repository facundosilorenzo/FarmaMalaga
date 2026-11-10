# Design

## World
**Placa de azulejo malagueña.** The site is built from Málaga's glazed street plaques: glazed white tile as the ground, cobalt painted lettering, an ochre frame of patterned tiles. Grout lines are the only hairlines. Cobalt drenches the contact band; the footer is cobalt night under an ochre tile strip.

## Color tokens (`css/styles.css :root`)
| Token | Hex | Use |
|---|---|---|
| `--glaze` | #f3f5f4 | page ground, tile faces |
| `--glaze-deep` | #e6ebea | alternate section ground (Servicios) |
| `--grout` | #cfd7d6 | hairlines, tile grout |
| `--ink` | #10204a | text on glaze |
| `--ink-soft` | #3b4a72 | secondary text on glaze |
| `--cobalt` | #1d3f94 | painted ink: headings, primary buttons, selected tab, CTA band |
| `--cobalt-deep` / `--cobalt-night` | #132c6c / #0d1f4f | hover, footer |
| `--on-cobalt` / `--on-cobalt-soft` | #f3f5f4 / #bccaf0 | text on cobalt (tinted, never gray) |
| `--ochre` | #d39a1f | frame tiles, rules, shop button |
| `--ochre-ink` | #7a4f00 | ochre text on glaze (formats, "Desde 1894") |
| `--open` / `--closed` | #17734a / #a1392a | open-now status |

## Type
- Display: **Young Serif** (self-hosted, `assets/fonts`). Plaque lettering, headings, product names, years.
- Body/UI: **Figtree** variable (self-hosted).
- Plaque lettering is uppercase with wide tracking; headings sentence case. Hours use `tabular-nums`.
- No eyebrows above headings, no section numbers, no gradient text.

## Components
- **Plaque** (`.plaque`): ochre frame from the `--frame-tile` SVG, cobalt 3px inner line, glazed field with grout grid and a soft glaze sheen. Used for the hero and, as `.panel`, for the pharmacy detail.
- **Tile tabs** (`.tile-tab`): pharmacy selector; selected = cobalt tile.
- **Shelf** (`.shelf`): own-line products as a ruled list with formats in ochre ink.
- **Timeline**: six cobalt-edged tiles set in an ochre tile frame.

## Layout
Max width 74rem, gutter `clamp(1rem, 4vw, 3rem)`, spacing scale `--s-1 … --s-9`. Section head: heading left, lede right; stacked under 52rem.

## Motion
- One authored moment: choosing a pharmacy turns the detail plaque like a tile in the hand (rotateY −78°→0 with 2px blur, 420ms `--ease-out`). Keyboard tab changes are instant.
- Feedback: buttons `scale(0.97)` on `:active`. Nav underline grows in ochre on hover.
- `prefers-reduced-motion`: the turn becomes a 160ms fade; no transforms.

## Browser surfaces
Selection cobalt (ochre on the CTA band), focus ring ochre, caret and scrollbar cobalt.
