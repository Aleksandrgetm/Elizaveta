# Services index — 2026-10-07

Added section `#service-index` between the existing content formats and Contact.
The four services use the supplied copy, existing typefaces and real project
photos / UGC posters. No prices, card grid, generated images or new dependencies.
The Contact chapter marker advances to 07; its content and layout are preserved.

## Interaction

- Desktop from 1100px wide and 820px high: one visual stage, four indexed scenes,
  1.8 viewport heights of pinning, click and scroll selection kept in sync.
- Smaller screens: native button accordion, four collapsed rows initially.
- Reduced motion or unavailable GSAP: all details remain visible in document flow.
- Image clipping, text masks, staggered feature lines, Reel-then-Stories reveal,
  and a photo stack opening into a collage.
- Existing media viewer opens only on explicit preview selection. No video/source
  elements exist before selection; closing removes video sources.
- Active service survives the viewer's fixed-body scroll lock. A breakpoint
  change while the viewer is open preserves its opener and restores the service
  location when the viewer closes.

## Browser verification

Local browser visual pass at 320×740, 375×812, 390×844, 430×932, 768×1024,
1024×900 and 1440×900. Document horizontal overflow was 0 at every width.
All four desktop scenes, mobile index, mobile video/photo compositions,
Enter/Space activation, direct selection, scroll-driven selection, poster loading,
and media open/close were checked.

Native Reels played with readyState 4 and no media error. Desktop Reels + Stories
opened the clothing video. Closing returns focus to its preview button and
releases video sources. Desktop → 390px while playing preserves the selected
service and returns to its visible header after close. Browser error/warning log
was empty on the checked final layout.

## Separate refinement pass

- Limited Reel height to its composition on desktop/tablet, removing overlap with
  the visual caption while preserving the vertical aspect ratio.
- Increased contrast of the small service numbers and feature labels.
- Kept collage edges inside 320px (rightmost photo <315px).
- Protected media opener/focus from ScrollTrigger updates during body locking.

## Automated validation

`npm run check`: existing document/assets, World, media and byte-exact original
video checks; new Services controller checks for accordion state, focus/inert,
rapid toggles, natural height, no-motion fallback, bounded pin, selection,
responsive cleanup and modal/resize integration. `git diff --check` is clean.

Screenshots: `screenshots/services-desktop.png`,
`screenshots/services-mobile-index.png`, `screenshots/services-mobile-stories.png`.
