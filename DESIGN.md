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
Easing family: `--ease-out` cubic-bezier(0.16,1,0.3,1) for entrances, `--ease-snap` cubic-bezier(0.23,1,0.32,1) for UI, `--ease-drawer` cubic-bezier(0.32,0.72,0,1) for sheets. Never ease-in.
- **Home entrance** (one choreography, once per visit): the plaque lands into its tilt (900ms), the heading wipes in with a blur (140ms later), the plaque name tightens its tracking, the ochre rule draws, then lede, actions and status rise.
- **Held tile:** on fine pointers the hero plaque follows the cursor (max 7°/9°, lerped) and the glaze sheen slides with it.
- **Pharmacy tabs:** the detail plaque turns like a tile (rotateY −78°→0, 420ms). Keyboard changes are instant.
- **Scroll reveals, once:** section headings wipe in; history tiles flip over in a decelerating sequence; own-line rows slide along the ochre rule; services rise.
- **Shop:** category chips share a sliding cobalt ink (300ms); filtered results rise with a decelerating stagger capped at 8 items; sort reorders with View Transitions; "Añadir" morphs to a check, the product photo flies along a curve into the bag, the bag catches it and the count bumps; toasts slide up; quick view scales from the tile that opened it (bottom sheet on phones); cart drawer slides from the right; removed lines collapse; the total ticks.
- Feedback: buttons `scale(0.97)` on `:active`. Open-now dot breathes every few seconds.
- `prefers-reduced-motion`: all of the above collapse to short opacity fades; tilt, fly-to-cart and breathing are off.

## Browser surfaces
Selection cobalt (ochre on the CTA band), focus ring ochre, caret and scrollbar cobalt.
