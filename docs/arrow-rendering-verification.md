# Arrow rendering correction — 2026-10-07

Audited all V2 arrows in navigation, CTAs, contacts, carousel controls and the media viewer. Seven northeast arrows (`U+2197`) and three service play triangles (`U+25B6`) can use emoji presentation. The four left/right and two up/down arrows are text-only codepoints and were left unchanged. The archived V1 down arrow is also text-only.

Tried U+FE0E using the existing text stack and compared it with an explicit Hiragino text font. It retained the macOS contour but still depended on platform font fallback. Local CoreText inspection identified the existing northeast contour and advance in Hiragino Sans W3 and the play triangle in Lucida Grande. SVG definitions preserve those outlines and advances; no icon library was used.

Desktop keeps the original text glyphs with FE0E and `font-variant-emoji:text`, preserving native font rasterization. SVG is used at widths up to 768 px and on devices with a coarse primary pointer and no hover, including iPhone landscape above 768 px. In that branch all ten emoji-capable text instances are hidden. The SVGs use `currentColor`, the existing font sizes, and the original outer spans. Existing hover transforms, transitions, button geometry and all scroll animation files are unchanged.

Browser verification:

- Desktop 1440 px: both CTA arrow wrappers remain 23.203125 × 22 px with the same `transform 0.25s` transition. All new SVGs are hidden; text wrappers use `display:contents` so they do not add boxes or duplicate transforms.
- Mobile 320, 375, 390, 430 and 768 px: all ten text fallbacks are hidden, SVG counterparts render, and document horizontal overflow is zero. Inspected contact arrows at 390 px and the service play triangle in its original 44 px circle.
- Service play button opens the existing viewer; left/right viewer arrow labels and controls remain intact. The viewer closes normally. Browser error/warning log is empty.
- Saved desktop and mobile screenshots in `docs/screenshots/arrows-desktop-preserved.png` and `docs/screenshots/arrows-mobile-390.png`.
- `npm run check` and `git diff --check` passed. Temporary comparison page was removed before publication.

No physical iPhone was connected. Responsive rendering and SVG/text branch selection were checked in the local browser; the mobile visible glyphs contain SVG paths and do not depend on an emoji font.
