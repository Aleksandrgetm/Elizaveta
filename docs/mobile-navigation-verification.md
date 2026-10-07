# Mobile navigation verification — 2026-10-07

Scope: mobile/tablet navigation at widths up to and including 768 px. Existing section markup, images, desktop header CSS and section motion are unchanged. The shared body-lock helper now accepts a class name; its media-viewer default remains `modal-open`.

## Browser checks

Tested the local served site in the Codex browser at 320×568, 375×812, 390×844, 430×932, 600×960 and 768×1024. All six labels fit, decorative assets remain clear of text, and document horizontal overflow is zero. The 320×568 menu scrolls internally to its bottom caption while the top controls stay visible; the underlying page remains fixed at its saved position.

- Header: 64 px normally, 58 px when scrolling down; scrolling up restores its normal state. The logo is left, existing fawn centered, custom 44×44 button right.
- Six real anchor destinations were clicked and verified after scrolling. Section tops settled at approximately 78 px: About 78.23, Directions 77.98, Work 78.04, Services 77.85, What I Create 78.13, Contact 78.14. Opening the menu again marked the correct link with `aria-current="location"` in all six cases.
- Closing precedes scrolling. ScrollTrigger refreshes caused native smooth scrolling to stop early during lazy-image loads; a 600 ms menu-owned scroll now follows the live anchor. Wheel, touch and navigation keys cancel that scroll. Existing section motion remains intact.
- Native dialog restricts interaction to the menu. Initial focus moves to the active/first row, Tab and Shift+Tab wrap within it, Escape closes it, and focus returns to the burger with the body styles restored.
- Rapid close/reopen keeps one body lock and stays open. An old queued native `close` event cannot dismiss a newly opened menu.
- Crossing to 769 px closes the dialog, restores scrolling and focuses the desktop wordmark; the burger is hidden and original links are visible. At 1440×900, desktop header/logo/fawn/navigation geometry matched the baseline captured before edits.
- Social URLs are the existing Instagram and Telegram `waniloow` profiles and `mailto:lbritakina@gmail.com`; external links retain `noopener noreferrer`.
- Browser error/warning log was empty after the final checks.

## Separate visual pass

Revisited typography, row rhythm, index alignment, touch targets and negative space on all six widths after functional testing. Kept just two existing accents (star and petals). Prevented the bottom contact group from flex-shrinking on short screens. Verified the italic/underlined active state and the compact-header/open-menu alignment. Saved final 390 px and 320 px screenshots in `docs/screenshots/mobile-navigation-390.png` and `docs/screenshots/mobile-navigation-320.png`.

## Automated checks

`npm run check` and `git diff --check` passed. New dependency-free controller checks cover real destinations, geometry-based active selection despite different menu/DOM order, focus wrapping, Escape, body-lock ownership, queued close/reopen, animation reversal, interrupted scrolling, breakpoint cleanup and reduced-motion behavior. Reduced-motion preference changes are covered in the controller fixtures; browser visual checks used the normal motion preference.
