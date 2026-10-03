# Assets / sources / licenses — V2

## Production imagery

- `dist/assets/photos/liza-*.webp`: eight photos supplied by the user for Liza's portfolio. Original HEIC/JPG retained outside repository; all prepared variants retained. No third-party photos or other creators' work used.
- `dist/assets/vinyl.webp`, `dist/assets/camera.webp`: bespoke generated assets from the first build, repurposed as physical objects in the new art direction. Built-in imagegen outputs; not downloaded from Pinterest/Google. See original prompts in `docs/design.md`. Camera = digital camera + sunglasses; vinyl = blush translucent disc. The old envelope bitmap is not used by V2.
- Envelope, folded letter, tape, film perforations, original monogram postage graphic: authored specifically in `dist/styles.css`; permitted explicitly in the V2 brief. They are purposeful objects, not a replacement library of generic sparkles. No externally copyrighted artwork.

## Web research (references only, NOT production assets)

- https://commons.wikimedia.org/wiki/File:Japan_1961_Bellflower.jpg — examined as a botanical postage reference; search metadata lists public domain in Japan. Full license page could not be reliably retrieved, so the image is NOT used.
- https://commons.wikimedia.org/wiki/File:Bermuda_1970_24_Cent_Stamp_Morning_Glory_BM_260.jpg — candidate stamp reference; NOT downloaded or used.
- Initial user-provided screenshots and animation reference were revisited. No copied brand marks, чужие portfolio videos, testimonials or prices.

## Fonts (self-hosted WOFF2)

- Prata — https://github.com/google/fonts/tree/main/ofl/prata — SIL Open Font License 1.1.
- Golos Text — https://github.com/google/fonts/tree/main/ofl/golostext — SIL Open Font License 1.1.
- Marck Script — https://github.com/google/fonts/tree/main/ofl/marckscript — SIL Open Font License 1.1.
- Served from Google Fonts CSS endpoint with Latin and Cyrillic subsets saved locally as `v2-font-*.woff2`. Three families only; the first version's fonts are no longer referenced.

## Motion dependency

- GSAP + ScrollTrigger, npm `gsap`, exact version pinned in package-lock.json. Sources: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ and https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ . License: https://gsap.com/standard-license/ ; license links and copyright headers retained in vendored files. Production minified files copied into `dist/vendor/`, no external CDN request on page load.

Official OFL text files downloaded directly from the three Google Fonts repository directories and stored in `dist/assets/fonts/*-OFL.txt`.
