# FarmaMálaga website

Static site: `index.html`, `tienda.html` (shop prototype: `css/tienda.css`, `js/tienda.js`, catalogue in `js/productos.js`), `legal.html`, `css/styles.css`, `js/config.js` (business data: phones, hours, links), `js/main.js` (open-now status, pharmacy tabs, mobile nav). No build step, no dependencies, no cookies, fonts self-hosted. User-facing copy is Spanish from Spain (tú).

## Design and motion guidelines (required)
Before any UI change:
1. Read `PRODUCT.md` and `DESIGN.md`.
2. Follow the **impeccable** skill (`.claude/skills/impeccable/SKILL.md`) and read `.claude/skills/impeccable/reference/craft-floor.md` right before editing UI.
3. For anything that moves, follow **emil-design-eng** (`.claude/skills/emil-design-eng/SKILL.md`); use `animate`, `review-animations` or `improve-animations` for motion work.

## Rules of thumb
- Content must remain visible if JS fails (`html.no-js`): all pharmacy panels show stacked, static hours stay in the HTML.
- Business data lives in `js/config.js`; keep the static HTML hours in sync with it.
- No invented reviews, prices, awards or figures. Health claims only as the services really are.
- Every animation needs a `prefers-reduced-motion` path.
- The shop is a design prototype: keep the ribbon saying so until checkout is connected. Products/prices in `js/productos.js` were copied from farmamalaga.com on 2026-11-10; photos load from that site.
