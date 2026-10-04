# V2 visual correction — 2026-10-04

Scoped update to the existing V2. Section order, photography, film, and existing scroll animations are preserved.

- Removed the Hero down-arrow anchor and its CSS. No replacement indicator or arrow-specific animation remains.
- Confirmed the About heading in the original V2 (`c1f48d0`), previous pass (`6a2ee4a`), and starting HEAD (`0a31774`): **Давайте знакомиться!** The heading was already unchanged, so it is retained verbatim.
- Replaced the square About label with a soft-pink circle inside the photo: 98 px at the upper-right on desktop, 72 px at the upper-left on mobile. The face remains unobstructed. Added only a subtle scale/rotation entrance inside the existing reduced-motion-aware scene setup.
- Moved the provided paperclip and candle into wrappers inside `.format-photo`, at its upper-left and lower-right corners. Both inherit photo rotation and movement. The original JPG files are unchanged; an SVG alpha filter removes their white backgrounds when rendered on the photo.
- Enlarged Contact copy to `clamp(26px, 1.85vw, 30px)` on desktop and `clamp(18px, 5.1vw, 22px)` on mobile. The text is two lines at 1024/1440 px and three lines at the smaller checked widths. Existing Contact portrait is preserved.

## Verification

Visually opened About, My Approach, and Contact at **320, 375, 390, 430, 768, 1024, and 1440 px**. Also inspected Hero at 320 and 1440 px. All 23 scene captures have document width equal to viewport width, zero Hero arrow elements, and no browser warnings/errors. See `visual-correction-layout.json` for recorded geometry and typography.

At 1440 px, a 280 px scroll moved the photo, paperclip, and candle by the same 280 px, without relative displacement. Decoration bounds remain inside the viewport at all checked widths.

`npm run check` passed all four existing suites: references/syntax, motion and reduced motion, V2 structure/fallback/V1 preservation, and media-dialog interactions. `git diff --check` passed. No new test framework or dependencies were added.

Screenshots: `screenshots/visual-correction-about.png`, `screenshots/visual-correction-approach.png`, `screenshots/visual-correction-contact.png`, and `screenshots/visual-correction-mobile.png`.
