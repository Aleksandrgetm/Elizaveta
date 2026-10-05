# Directions storytelling — 2026-10-05

Rebuilt only «МОИ НАПРАВЛЕНИЯ» (`#niches`) from source `56f8db1`.

The five oval bubbles and all connecting lines are removed. The section now has five sequential compositions with a recurring framed portrait. Its pink background, heading, subtitle, exact category descriptions, five supplied editorial photos, black-dress bouquet portrait, lace frame with its embedded pink bow, and existing petals remain unchanged.

## Interaction

- Desktop at 1024 px or wider and at least 700 px high: GSAP intro, five image-mask/text/portrait transitions, and a ScrollTrigger pin with 2.4 viewport heights of extra scrolling. Category buttons also navigate directly to the matching state. Travel releases naturally into Work.
- Smaller viewports: native horizontal scroll-snap carousel and scrollable category selector; no pin or carousel dependency. A horizontal gesture updates the selected category. A direct native tap changes category without changing vertical scroll position.
- Keyboard: ArrowLeft/ArrowRight, Home, End, and Tab; real buttons with tabs/panels, selected state, and managed focus. Inactive panels are inert.
- Reduced motion and unavailable GSAP: accessible native tabs/carousel without pin or allocated animations.
- Media-query changes remove the previous pin, animations, listeners, and inline styles before the new mode starts. The World pin is created before the downstream Work pin.

## Visual refinement

The first rendered pass exposed portrait-frame overlap on Lifestyle and Wellness text. The portrait positions and text columns were refined so all copy stays clear; Lifestyle retains a deliberate photo/frame overlap. Travel uses the largest category image. Extra space after the pinned scene keeps Work's existing rounded transition clear of the navigation. At 320 px, the subtitle was adjusted to remain one line. The final intro settles within 0.72 seconds.

Visually checked 320, 375, 390, 430, 768, 1024, and 1440 px. All five desktop states were opened and inspected. Verified click navigation, keyboard controls, forward/reverse scrolling, mobile horizontal scrolling, native tap behavior, desktop/mobile resizing, and unpin into Work. All recorded widths have no horizontal overflow and no browser warnings/errors; one tab and one accessible panel are active. Rendered the reduced-mode module path and missing-GSAP fallback in temporary local QA pages, then removed those pages before packaging. The OS motion preference was not changed.

## Regression checks

`npm run check` passes all five suites, including the new executable World behavior checks. `git diff --check` passes. A separate read-only review confirmed all 436 non-World CSS rules and their media-query ancestry are unchanged, as is component markup outside `World()`. Photography and V1 files are untouched.

Recorded geometry: `directions-story-layout.json`. Final screenshots are under `screenshots/directions-story-*.png`.
