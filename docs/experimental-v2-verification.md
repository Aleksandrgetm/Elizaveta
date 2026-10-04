# Experimental V2 — verification

Date: 2026-10-04. Base V1 commit: `b2cc1219ca0c7dd3d5f09adfadcd408f67a833b4` in the nested `site/` repository.

## Delivered

A separate frontend (`v2-*`, `v2.js`, `v2.css`) replaces the primary page. The original index is copied byte-for-byte into `dist/v1.html`; original JS, styles and assets are kept. History is preserved. No UI/UX skill, stock replacement images, heavy smooth-scroll engine or WebGL were used.

Nine scenes: cover, About, moving film, vinyl desk, five directions, Work, formats, Moments and Connect. The seven-item chapter indicator groups Contents and Directions under WORLD. Section labels follow the more detailed 01–07 scene numbering in the brief.

## Automated checks

`npm run check` passes original checks plus:

- V2 syntax and composed-document semantics, unique IDs, local anchors and ARIA references.
- Exact supplied hero/category image mapping, all local photo/decor/font paths and responsive image sources.
- 12 editable work slots, 9 content formats, 6 Moments photos, preserved V1 and no initial video elements.
- Executed reduced-motion branch creates zero GSAP animations; no-GSAP work controls remain functional.
- Media controller execution: empty-source preview; Next/Previous; Escape; focus and scroll restoration; selected-source-only video creation; preload none and inline controls; cleanup on switching/close; stale error isolation and failed-video poster fallback.

The media controller suite uses a minimal DOM host adapter. It does not claim real video decoding or browser rendering coverage.

## In-browser verification

Used the Codex in-app browser with actual local site, screenshots and read-only DOM inspection. Checked widths **320, 390, 768, 1280 and 1440px** (including 390×844, 1280×720, 1440×900). This is responsive browser QA, not a physical iPhone/Safari or measured Core Web Vitals run.

- No page-level horizontal overflow at those widths. All inspected loaded images had valid natural dimensions; no browser errors/warnings were logged.
- Mobile hero uses the same restaurant/chopsticks photograph in its supplied portrait framing. Desktop uses the supplied landscape framing.
- At 390px: no pin spacer, custom cursor hidden, zero video elements before selection, native `x mandatory` Work scrolling updates the current index (01 → 02).
- Desktop 1440×900: one Work pin; poster aspect ratio measured 0.5625 (9:16); native vertical scrolling changes track position, active index (01 → 05) and progress. On 1280×720, the pinned scene is 618px tall, fitting the viewport.
- Category interaction selected LIFESTYLE and set `aria-pressed="true"` while keeping the centre portrait visible.
- Mobile viewer opens the selected preview, Next updates title/counter, Escape closes and restores the originating card and exact scroll position (4850px).
- Desktop viewer restores exact scroll position (5157px) after closing. Explicit Tab loop verified: Shift+Tab from Close → Next; Tab from Next → Close, both inside dialog.
- Real contact URLs checked: Instagram and Telegram @waniloow; mailto:lbritakina@gmail.com. No messages sent.
- About, desk, World, Work, formats, Moments and letter scenes visually inspected. Narrow desk objects reduced to avoid covering navigation labels. Tablet Work heading wrapping and progress-bar scaling corrected during QA.

Representative screenshots are in `docs/screenshots/experimental-*.png`.

## Content limitation

No actual videos exist in the repository. Twelve original work slots still have empty `src`, so the new presentation honestly displays photo previews. Real playback, codec compatibility and streaming behavior cannot be verified until Liza's media is added. Loading/cleanup/error behavior is covered independently by the controller tests.
