# Experimental V2 — fresh visual asset audit

Audit date: 2026-10-04. This audit was completed before the experimental frontend implementation. Every supplied original image was viewed in fresh contact sheets; every distinct prepared image and all restaurant export sizes were also visually inspected. The supplied files were preserved. No UI/UX skill, generated replacement imagery, external stock photos, or destructive Git operations were used.

## Inventory and method

- `assets/`: 36 image originals — 7 photographs and 29 decorations; 35 JPG/JPEG files and 1 PNG.
- `dist/assets/`: 64 WebP files, comprising the prepared photographs, three restaurant widths, category images, decorative cutouts and existing physical objects. The 8 older Liza photographs each have 480/960/1440 named variants; one representative of each was viewed because these are the same photo at different sizes.
- Other prepared assets: 14 WOFF2 files, 3 font licenses, 2 font CSS files, 2 manifests and one doodles SVG. The self-hosted font CSS contains explicit Cyrillic subsets for Golos Text, Marck Script and Prata.
- The complete project directory was scanned for videos: **no MP4, MOV, WebM or other actual video media files are present**. `dist/content.js` has 12 draft work slots, all with empty `src`. Their posters currently reuse supplied Liza photos; these are not video-derived poster frames. A working player can be retained, but genuine playable work cannot be claimed until sources are supplied.
- Contact sheets used for this independent audit: `/tmp/v2-originals-{1,2}.jpg`, `/tmp/v2-prepared-{1,2,3}.jpg`. Machine inventory: `/tmp/v2-asset-inventory.json`.

## Required scene mapping — visually verified

The browser paths below are relative to `dist/`.

| Role | Original | Prepared browser asset | Visual identification |
|---|---|---|---|
| HERO PHOTO | `assets/hero/telegram-cloud-photo-size-2-5334606934100877517-y.jpg` | `assets/editorial/restaurant-{640,960,1280}.webp` | Liza at a restaurant table holding chopsticks; dark wooden horizontal blinds behind her. Original is 1280 × 720. |
| CENTER FLOWERS PORTRAIT | `assets/направления/telegram-cloud-photo-size-2-5334606934100877510-w.jpg` | `assets/editorial/flower-portrait.webp` | Liza turned over her shoulder, holding a large pale-pink bouquet, in a black open-back dress. |
| BEAUTY | `assets/направления/telegram-cloud-photo-size-2-5334606934100877511-w.jpg` | `assets/editorial/beauty.webp` | Pink cosmetics desk, tablet reading BEAUTY SECRETS, visible e.l.f. compact and other makeup. |
| FASHION | `assets/направления/telegram-cloud-photo-size-2-5334606934100877513-y.jpg` | `assets/editorial/fashion.webp` | Woman in a pale-pink satin blouse with short puff sleeves. |
| LIFESTYLE | `assets/направления/telegram-cloud-photo-size-2-5334606934100877512-y.jpg` | `assets/editorial/lifestyle.webp` | Liza with pink hair rollers, drinking from a pink mug. Do not describe this object as a cosmetics bottle. |
| WELLNESS | `assets/направления/telegram-cloud-photo-size-2-5334606934100877515-w.jpg` | `assets/editorial/wellness.webp` | Pink exercise mat, pink bottle, fitness ball and exercise bands; tablet above the mat. |
| TRAVEL | `assets/направления/telegram-cloud-photo-size-2-5334606934100877514-w.jpg` | `assets/editorial/travel.webp` | Airplane-window view of wing, clouds and sunset. |
| VINYL | Existing approved first-build asset | `assets/vinyl.webp` | Smooth blush-pink translucent grooved record with a plain brown centre and a tiny spindle hole. History verified below. |
| PHONE | `assets/decor/телефон 1.jpg` | `assets/decor/objects/retro-phone.webp` | Open pink jewelled flip phone and heart charm. |
| EARPHONES | `assets/decor/наушники.png` | `assets/decor/objects/wired-earphones.webp` | White wired earbuds with a Lightning connector. |
| CASSETTE | `assets/decor/касета.jpg` | `assets/decor/objects/pink-cassette.webp` | Pink audio cassette. |
| BOW | `assets/decor/бантик.jpg` | `assets/decor/objects/pink-bow.webp` | Wide satin pink bow. |
| DEER | `assets/decor/IMG_1475.JPG` | `assets/editorial/fawn.webp` | Small pixel-art spotted fawn. Suitable for one small easter egg. |
| WAX SEAL | `assets/decor/IMG_1476.JPG` | `assets/editorial/wax-seal.webp` | Pale blush circular wax seal with raised swan. Reserve for the letter finale. |
| KEY | `assets/decor/IMG_1477.JPG` | `assets/editorial/ribbon-key.webp` | Ornate antique-gold key tied with a pink gingham bow. |
| PETALS | `assets/decor/IMG_1478.JPG` | `assets/editorial/rose-petals.webp` | Two real pink rose petals. |
| STARS | `assets/decor/звездочка.jpg`, `звездочки.jpg`, `ромбики.jpg` | `assets/decor/stars/star-handdrawn.webp`, `star-trio.webp`, `diamond-sparkles.webp` | Respectively one hand-drawn outline star, three outline stars, and four-point hand-drawn sparkles. |
| HEARTS | `assets/decor/сердечки.jpg` | `assets/decor/hearts/heart-doodles.webp` | Three irregular hand-drawn outline hearts. |
| FRAME | Existing prepared asset | `assets/lace-frame.webp` | Cream ornamental oval lace frame with small pink bow; transparent centre. |
| SIGNATURE | Existing prepared asset | `assets/elizaveta-signature.webp` | Fine handwritten Cyrillic «Елизавета». Useful existing art; live Marck Script Cyrillic text is also available. |

## Vinyl history resolution

Use **`dist/assets/vinyl.webp`**, not `dist/assets/decor/vinyl/pink-vinyl.webp`.

- `git log --all -- dist/assets/vinyl.webp` identifies first commit `27920c5`.
- `git rev-parse HEAD:dist/assets/vinyl.webp` and `git rev-parse 27920c5:dist/assets/vinyl.webp` both resolve to **`26754c95adafba99887e568d92db8e429e285e27`**.
- Therefore the approved previous record still exists byte-for-byte in the working asset tree; restoring or checking out historical files is unnecessary.
- It is 1100 × 1100 RGBA, 114,744 bytes, with transparent exterior.
- The later replacement was introduced in `e3330a2`: source `assets/decor/диск.jpg` → prepared `dist/assets/decor/vinyl/pink-vinyl.webp`. Visually, this is a marbled/patterned pink CD with a large black hub. Preserve it as a user asset, but do not use it for this scene.

## Complete numbered decorative additions

All were opened visually, including those unused by V1.

| Source | Verified content | Existing prepared file |
|---|---|---|
| `IMG_1475.JPG` | Pixel-art fawn | `editorial/fawn.webp` |
| `IMG_1476.JPG` | Swan wax seal | `editorial/wax-seal.webp` |
| `IMG_1477.JPG` | Antique key and pink gingham bow | `editorial/ribbon-key.webp` |
| `IMG_1478.JPG` | Two pink rose petals | `editorial/rose-petals.webp` |
| `IMG_1479.JPG` | Pink gingham star cutout | None |
| `IMG_1480.JPG` | White postage stamp with a pink lily and cancellation marks | `editorial/flower-stamp.webp` |
| `IMG_1481.JPG` | Pink metal binder clip | None |
| `IMG_1482.JPG` | Cream padded/fabric heart with ruffled edge | None |
| `IMG_1483.JPG` | Small pale hooded figurine with black eyes | None |
| `IMG_1484.JPG` | Closed white envelope wrapped with blush ribbon | None |
| `IMG_1485.JPG` | Pink/metallic star confetti | `editorial/pink-star-confetti.webp` |
| `IMG_1486.JPG` | Narrow pink dotted ribbon bow | None |
| `IMG_1487.JPG` | Silver Canon compact camera | None |
| `IMG_1488.JPG` | Pink candle in a clear jar with printed label | None |
| `IMG_1489.JPG` | Lit amber glass candle, black lid, Cashmere and Vanilla label | None |

Other supplied decorations not required in every scene: `губы.jpg` (red lip print), `зеркало.jpg` (ornate gold handheld mirror with ribbon), `камера.jpg` (silver Sony Cyber-shot camera with stickers), `кисточка.jpg` (pink-handled makeup brush), and `тэйп.jpg` (torn cream paper tape). Correct prepared files already exist under `assets/decor/objects/` or `assets/decor/stickers/`.

## Existing Liza photographs for film and moments

All paths have 480/960/1440 named WebP variants under `dist/assets/photos/`.

| ID | Verified content |
|---|---|
| `0994` | Close selfie with pearl necklace, dark top, pursed lips. |
| `2681` | Side-facing portrait in a burgundy striped shirt. |
| `2688` | Selfie in burgundy striped shirt, large white flowers beside Liza. This is **not** the required black-dress centre portrait. |
| `5712` | Liza crouched on a city pavement in black top, tan trousers and sunglasses. |
| `5788` | Portrait framing of Liza at the restaurant holding chopsticks, with soup bowl and table visible. Same restaurant subject as the supplied landscape hero. The 1440-named file is 900 × 1600. |
| `7454` | Full-body outfit at stone steps, black top and pale pink shorts. |
| `8011` | Seated on stone steps in pale green top and white skirt. |
| `8470` | Mirror selfie wearing a yellow/black striped long-sleeve top and white skirt. |

The five older `dist/assets/niches/*.webp` assets are different imagery: brown skincare bottles, a handbag, coffee/candle still life, a matcha cup, and an airplane view. They were inspected and retained, but do **not** satisfy the new strict category mapping. The required categories must use `assets/editorial/*.webp`.

Additional retained first-build objects: cream open envelope with pink liner (`assets/envelope.webp`), silver camera with black sunglasses (`assets/camera.webp`), and smiling felt-style strawberry (`assets/strawberry.webp`). These are existing prepared assets, not new user decoration replacements.
