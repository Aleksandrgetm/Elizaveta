# Supplied decoration revision

All 15 files in assets/decor were visually inspected. No image generation or web asset search was used. Originals are preserved. Reproducible preparation: scripts/prepare-user-decor.py (Pillow). Web outputs and dimensions: dist/assets/decor/manifest.json.

Used: диск.jpg (physical rotating disc); телефон 1.jpg (lower-left phone); наушники.jpg (right earphones); касета.jpg (lower-right cassette); бантик.jpg (upper-right bow and Works); звездочка.jpg, звездочки.jpg, ромбики.jpg (varied marks across Hero, Contents, Niches, Works, Contact); сердечки.jpg (one Contents cluster); камера.jpg (existing Hero camera); губы.jpg (Contact); тэйп.jpg (existing photo tape).

Not placed: зеркало.jpg and кисточка.jpg — additional large objects would compete with portraits and the main collage. телефон.png is fully transparent (all RGBA channels zero). No cherries, candy, or circular sticker were supplied; none were synthesized or sourced elsewhere. These absent items prevent an exact replica of every reference object. Upper-right bow is the provided accent, not a fake cherries substitute.

Contents is between About/photo film and Niches at #contents. Desktop disc is 46% of scene width, left27%, top8%; main composition is matched to reference proportions. On phones the disc is94% viewport width. Typography sits in a separate nav overlay. GSAP ScrollTrigger rotates only .vinyl-physical from -25 to95deg; the nav layer has no transform. Peripheral props receive distinct small scroll translations and rotations, reduced on mobile. No infinite ambient loop. Reduced motion exits before any GSAP animation. Five native anchors exist, including #services, a compact list of existing content formats in Works (no invented copy).

Removed from rendered site: former vinyl sleeve/tracklist/annotation, old doodles.svg decoration instances (stars/arrow/loop/bow), generated strawberry mascot, old camera use, CSS tape shape. Old unreferenced files remain for recoverability. Existing lace frame and About composition remain intact.

WebP derivatives preserve aspect ratio and transparency. Disc retains native1066px detail; objects are220–680px maximum except disc. Above-fold decorative images eager; lower decorations lazy. Asset originals are not delivered to browsers.

QA: 320,375,390,430,768,1024,1440 widths: no document horizontal overflow; all five nav targets resolve; targets44px+ high. Mobile and desktop visual passes covered Hero, Contents, Niches, Works, Contact. Corrected duplicate camera found during pass. DOM confirms physical disc transform changes with scrolling while nav transform remains none. npm run check validates JS, assets, metadata, and reduced motion early exit. Visual smoothness checked in local preview, not a hardware performance benchmark.
