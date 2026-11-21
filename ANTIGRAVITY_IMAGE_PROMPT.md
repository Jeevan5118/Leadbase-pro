# Lead Base Pro — AI Image Art Direction & Replacement (Nano Banana)

**Role:** You are a senior UI/UX designer and art director who also ships front-end code. You will **generate a new, consistent set of photographs with Nano Banana** (Google's Gemini image model), one for every image slot on the Lead Base Pro website. Then you'll replace the current stock photos, optimise them for mobile and desktop, and verify everything visually. The images must sell **one story**: *"We find the businesses that buy from you, so your team closes more deals."*

**Project:** `D:\codeing\lead base pro`. Live at **https://leadbasepro.online**.
**Stack:** static site with no build step: `index.html`, `css/styles.css`, `js/main.js`, GSAP + ScrollTrigger + Lenis in `js/vendor/`. Photos currently live in `assets/img/*.jpg`, and every `<img>` has a `data-cdn` Unsplash fallback.
**Brand palette (images must harmonise with it):** Bone `#EEEAE2` (60%), Ink `#0C0E12` (30%), Signal orange `#FF5B1F` (10%).
**Brand name:** only ever **Lead Base Pro**. Never "Akshara Enterprises" or any other company name.

---

## 0. Gate 1: audit before generating anything

1. Read `index.html`, `css/styles.css` and `js/main.js` in full. The live code may differ from this brief, so work from what is actually there.
2. Build an **image inventory table** with these columns: section, CSS selector or container, current file, rendered aspect ratio (from CSS: `aspect-ratio`, or the measured box at 390px and 1440px wide), max rendered width at desktop and at mobile, whether it is above the fold, whether it carries a text overlay or a scrim, and its current alt text.
3. Compare your table with the **Shot List in §3**. If a slot exists in the code but not in §3, or the other way round, flag it and propose a shot that follows the same art direction. Do not silently skip a slot.
4. Confirm which Nano Banana model you can use:
   - Prefer **Nano Banana Pro** (`gemini-3-pro-image-preview`, or the current Pro image model) for the hero and CTA images, which are the most visible.
   - Use **Nano Banana** (`gemini-2.5-flash-image`, or the current Flash image model) for everything else.
   - If you are calling the Gemini API, read the key from the environment variable `GEMINI_API_KEY`. **Never** hard-code a key or commit it, and add `.env` to `.gitignore`.
   - If neither model is available, **stop and report**. Do not fall back to random stock photos.
5. Post the inventory table and the model you will use **before** generating.

---

## 1. Art direction (applies to every image)

### 1.1 Story and casting
- **Setting:** contemporary **urban India, mainly Bengaluru**: premium offices, hotel lobbies, restaurants, warehouses, hospitals, showrooms, factories. Settings must be modern, clean and aspirational, and still believable.
- **People:** Indian professionals aged roughly 25–55, with a natural mix of men and women in every set of images, and varied skin tones and body types. Wardrobe is smart-business: blazers, crisp shirts, kurtas with blazers, saris in a corporate setting, neat chef whites and hospitality uniforms where the scene calls for them. Nobody looks like an obvious model; casting should feel like real teams.
- **Mood:** confident, warm, in the middle of an action: shaking hands, signing, presenting, calling, pointing at a screen. Avoid stiff smiles straight into the camera. Avoid "stock-photo thumbs up".

### 1.2 Photography language (identical across all shots, so the set feels like one shoot)
- Photorealistic **editorial commercial photography**, as if shot on a full-frame camera.
- Lenses: 35mm for environment shots, 50mm for people, 85mm for hands and close details. Apertures f/2–f/4 with a natural, soft background blur.
- Light: **soft natural window light with warm highlights**. Gentle contrast, true-to-life skin, no HDR look, no plastic smoothing.
- **Colour grade:** warm neutrals and cream / bone tones, deep charcoal shadows, and **one small orange accent per frame** (an orange folder, mug, tie, cushion, lanyard, plant pot or signage glow). This ties every photo to the Signal orange brand colour. Avoid blue-teal "corporate" casts.
- Composition: leave **negative space where text or tags sit** (specified per shot in §3). The subject should sit on a third.

### 1.3 Hard rules (reject and regenerate if any of these are broken)
- **No readable text, logos, brand names, watermarks, UI text or numbers** anywhere: signage, laptops, documents, phones, shirts. Screens show abstract, blurred, non-readable charts or interface shapes only.
- **Hands must be anatomically correct**: five fingers each, natural grip, no fused or extra fingers. **Every handshake image must be checked at 100% zoom.**
- No distorted faces, no warped furniture lines, no melted cutlery or keyboards, no duplicated people, no floating objects.
- No real celebrities, no recognisable real people, and no real company premises or logos.
- No cartoon, 3D-render or illustration look. It must read as a photograph.
- Nothing sexualised, no alcohol as the focus, nothing that could read as a real customer testimonial.

### 1.4 Reusable style suffix
Append this to **every** prompt, word for word:

> *Photorealistic editorial commercial photograph, full-frame camera, natural soft window light, warm neutral colour grade with cream and charcoal tones, one small burnt-orange accent object in frame, shallow depth of field, true-to-life skin texture, modern premium Bengaluru setting, Indian professionals, candid in-the-moment action, clean composition with negative space. No text, no logos, no watermarks, no readable screens or documents, anatomically correct hands with five fingers, no distortion.*

---

## 2. Generation workflow (per image)

1. Generate **3 candidates** per slot at **at least 2048px on the long edge**, using the exact aspect ratio from §3. If the model can't output that ratio directly, generate a larger image and crop it deliberately; never stretch.
2. Run the **QA checklist** on each candidate: hands, faces, no text or logos, orange accent present, negative space where the overlay sits, matches the set's colour grade. Pick the best one. If all 3 fail, refine the prompt (be more specific about hands or camera angle) and regenerate. **Up to 3 rounds.**
3. If a person needs to appear in more than one shot, keep them consistent: use Nano Banana's multi-image / reference editing and pass the chosen hero image as a reference. In particular, the hero's deal-closing team may reappear in the CTA background.
4. Save the master as `assets/img/_masters/<slot>.png` (git-ignored) and log the final prompt, model and seed (if available) in `assets/img/PROMPTS.md`.
5. Edit with Nano Banana rather than starting over for small fixes: "make the folder burnt orange", "remove the text on the screen", "fix the left hand".

---

## 3. Shot list, section by section

Use these exact filenames. Ratios are width:height. "Overlay zone" = where on-page text, tags or scrims sit, which must be kept calm (low detail).

### HERO: 3D photo deck (4 cards, 4:5 portrait). **Highest priority; use Nano Banana Pro.**
The client wants the hero dominated by **deal-closing / handshake / corporate closing** imagery, mixed with one or two client-industry scenes. Card order matters: card 0 is front and centre and loads first (`fetchpriority="high"`).

| # | File | Deck tag (update in HTML) | Prompt (+ style suffix) | Overlay zone |
|---|---|---|---|---|
| 0 | `hero-deal-handshake.webp` | **Deal closed** | Close-up, slightly low angle: two Indian business professionals, a woman in a charcoal blazer and a man in a navy suit, shaking hands firmly across a modern boardroom table after closing a deal. Signed contract papers and a burnt-orange folder in the soft-focus foreground, colleagues smiling in the blurred background, floor-to-ceiling windows with the Bengaluru skyline behind. Hands sharp in focus. 85mm. | Bottom-left 25% |
| 1 | `hero-contract-signing.webp` | **Contracts signed** | Over-the-shoulder shot of a senior Indian businessman signing a contract with a premium pen in a glass-walled meeting room, a female procurement head watching approvingly across the table, laptop open with an abstract unreadable chart, an orange coffee mug, warm late-afternoon light. 50mm. | Bottom-left 25% |
| 2 | `hero-sales-win.webp` | **Sales teams** | A young, diverse Indian sales team in a modern open-plan office celebrating a closed deal: one person still on a headset smiling, another giving a high five, a third pointing at a monitor with abstract upward graphs (no readable text), an orange cushion on a chair, candid motion. 35mm. | Bottom-left 25% |
| 3 | `hero-hospitality-supplier.webp` | **Hotels & restaurants** | In an elegant hotel lobby lounge, an Indian supplier presents a fabric swatch / product sample book to a hotel general manager in a suit. Both are leaning in, engaged and nodding, with warm brass lighting, a marble table and an orange cushion on the sofa. Shows the kind of customer our clients reach. 50mm. | Bottom-left 25% |

Update the four `.deck__tag` labels in `index.html` to the tags above. Keep the 3D deck behaviour (pointer tilt, explode on scroll) exactly as it is.

### SECTION 01: Statement photo (4:3, landscape)
| File | Prompt | Overlay |
|---|---|---|
| `intro-sales-floor.webp` | An Indian inside-sales team at work on a bright sales floor: two people on headsets mid-call, one ticking off a printed list, laptops showing abstract blurred contact tables (no readable text), focused energy, an orange notebook on the desk, morning light. Conveys "selling, not searching". 35mm. | None |

### SECTION 02: "What's in every record" side-scroll (6 cards, 4:5 portrait, dark bottom gradient)
Each card shows the **field** in action. **Overlay zone: bottom 45% must be darker and calm** for the white text.

| File | Card | Prompt |
|---|---|---|
| `rec-business-name.webp` | 01 Business name | A row of modern storefronts and a boutique hotel entrance on a clean Bengaluru street at golden hour, the signage deliberately blurred and unreadable, a lone professional walking in with a portfolio bag, an orange awning accent. 35mm. |
| `rec-contact-number.webp` | 02 Contact number | A confident Indian female sales executive on a phone call, smiling mid-sentence, holding a smartphone to her ear at a standing desk, with a printed lead sheet (unreadable) and an orange pen. 50mm, the face in the upper half. |
| `rec-location.webp` | 03 Location & address | Aerial dusk view of Bengaluru, city lights and roads, glowing like a map, with subtle warm orange highlights on some buildings that suggest targeted pins. No text. 35mm, aerial. |
| `rec-website.webp` | 04 Website | Close-up of hands on a laptop browsing an abstract business website (blurred image blocks, no readable text), a notepad with handwritten unreadable notes, an orange sticky note, café-office desk, shallow focus. 50mm. |
| `rec-category.webp` | 05 Category & type | Split-feel composition through a glass partition: a hotel reception in front, a restaurant dining room softly visible behind, suggesting different business categories. Warm lighting, an orange flower arrangement. 35mm. |
| `rec-everything-else.webp` | 06 Everything else we find | An analyst's desk with two monitors showing an abstract, colourful data dashboard (shapes only, nothing readable), a magnifying lens beside them, a hand pointing at a chart, an orange mug. Moody but warm. 50mm. |

### SECTION 03: 3D flip card front (4:5 portrait)
| File | Prompt | Overlay |
|---|---|---|
| `flip-business-exterior.webp` | The entrance of a modern 3-star boutique hotel in Indiranagar, Bengaluru, at blue hour: warm interior glow, potted plants, a doorman, the signage blurred and unreadable, an orange lantern accent. Feels like "a business you could sell to". 35mm. | Bottom-left 20% |

### SECTION 04: Process (4 images, **4:5 portrait on desktop**; mobile shows them inline at 16:10). Generate at 4:5 and art-direct a safe centre crop for 16:10.
| File | Step | Prompt |
|---|---|---|
| `step-tell-us.webp` | 01 Tell us what you sell | An Indian product supplier lays out samples (hotel linen, toiletry bottles, kitchen tools) on a meeting table while explaining them to a Lead Base Pro consultant taking notes on a tablet (blank screen). An orange swatch among the samples. 50mm. |
| `step-market.webp` | 02 Pick your market | Two strategists standing over a large printed map of Karnataka and India on a table (no readable labels, abstract shapes), placing orange pins, warm overhead light, focused discussion. 35mm, high angle. |
| `step-collect.webp` | 03 We collect & structure | A research team at a modern workstation cluster, monitors showing abstract tables and spreadsheets (unreadable), one person organising cards on a glass wall, orange cable accents, calm and methodical. 35mm. |
| `step-close.webp` | 04 You start selling | On a showroom floor, an Indian salesperson shakes hands with a restaurant owner after a successful pitch, product boxes in the background, smiles, an orange box on the counter. Hands sharp. 50mm. |

### SECTION 05: Industries (10 thumbnails, **4:5**). These show at 300px on desktop hover and 64–96px inline on mobile, so they need **a clear subject that reads small**.
| File | Row ("you sell → buyers") | Prompt |
|---|---|---|
| `ind-linen.webp` | Hotel linen → hotels, resorts | A housekeeper smoothing crisp white linen on a luxury hotel bed, a folded orange throw. |
| `ind-kitchen.webp` | Commercial kitchen equipment → restaurants | An Indian chef in whites working at a gleaming stainless-steel commercial kitchen line, flames and steam, an orange towel. |
| `ind-housekeeping.webp` | Housekeeping supplies → hospitality | A neat housekeeping trolley in a hotel corridor with stacked towels and supplies, an orange spray bottle. |
| `ind-furniture.webp` | Hotel furniture → boutique hotels | A designer hotel lounge with modern sofas and armchairs, one burnt-orange armchair, warm light. |
| `ind-toiletries.webp` | Toiletries → guest houses | Minimal amenity bottles and a folded towel on a stone hotel vanity, one orange-capped bottle, no labels. |
| `ind-food.webp` | Food distribution → restaurants, caterers | A delivery staffer handing a crate of fresh produce to a restaurant manager at a back entrance, an orange crate. |
| `ind-laundry.webp` | Laundry equipment → hospitals, laundries | A row of industrial washing machines in a bright commercial laundry, a worker loading linen, an orange basket. |
| `ind-cctv.webp` | CCTV & security → commercial properties | A security professional installing a dome camera in a modern lobby ceiling, with a monitoring screen (abstract) blurred behind. |
| `ind-interior.webp` | Interior design → hospitality projects | An interior designer showing a material board (wood, fabric, an orange tile) to a restaurant owner in a half-finished fit-out. |
| `ind-software.webp` | Hotel software → hospitality groups | A front-desk manager using a tablet with an abstract booking interface (unreadable) at a sleek hotel reception, an orange pen holder. |

### SECTION 07: "Not just hotels" collage (5 images: g1 4:5, g2 1:1, g3 4:5, g4 4:3, g5 1:1), with caption chips bottom-left
| File | Caption | Prompt |
|---|---|---|
| `bey-distributors.webp` | Distributors | A modern distribution warehouse with tall racks, a manager with a tablet talking to a forklift operator, orange safety vests. |
| `bey-hospitals.webp` | Hospitals | A hospital procurement head meeting a medical-supplies rep in a bright corridor, both in smart attire, orange folder. |
| `bey-real-estate.webp` | Real estate | A developer and a client reviewing plans at a premium apartment site office with a scale model, orange hard hat on the table. |
| `bey-manufacturers.webp` | Manufacturers | A factory floor manager in a high-vis vest inspecting machined parts with an engineer, orange-painted machinery. |
| `bey-it-companies.webp` | IT companies | A tech startup office team in a stand-up meeting by a glass wall with sticky notes (unreadable), orange beanbag. |

### SECTION 09: Contact background (**16:9, 2560px wide**, shown full-bleed under a dark gradient). **Use Nano Banana Pro.**
| File | Prompt | Overlay |
|---|---|---|
| `cta-deal-celebration.webp` | Wide, cinematic shot of a modern Bengaluru boardroom at dusk: the hero deal team (keep them consistent with the reference image) standing, shaking hands and smiling around a table, the city skyline glowing through the windows, warm interior light, an orange accent chair. **Subjects placed in the right 45% of the frame; the left 55% is calm and darker** because the heading and form overlay it. 35mm. | Left 55% dark and quiet |

### SEO / social share image (new)
| File | Prompt |
|---|---|
| `og-image.jpg` (1200×630) | Generate a crop variant of `hero-deal-handshake` with calm space on the left. Then add the text **"Lead Base Pro: B2B lead databases"** in HTML/CSS rendering or a canvas overlay. Do **not** let the AI model draw text. Reference it with `<meta property="og:image">` and `<meta name="twitter:card" content="summary_large_image">`. |

---

## 4. Optimisation & implementation

1. **Formats and sizes.** Write a one-off Node script in `tools/optimize-images.mjs` using `sharp`. Install it only under `tools/` and keep it out of the deployed site. From each master, generate:
   - **WebP** at quality 78, plus an **AVIF** at quality 55,
   - widths **480, 800, 1200, 1800** (and 2560 for `cta-*` only),
   - naming: `assets/img/<slot>-<w>.webp` / `.avif`.
   - Strip metadata. Target sizes: hero card 0 at 800w **< 110 KB WebP**, any 1200w **< 220 KB**.
2. **Markup.** Replace each `<img>` with a `<picture>`: an AVIF `<source>`, then a WebP `<source>`, then a fallback `<img src="...-800.webp">`. Include accurate `sizes`:
   - hero cards: `(max-width: 999px) 66vw, 22vw`
   - records: `(max-width: 679px) 82vw, (max-width: 1199px) 44vw, 30vw`
   - industries: `(max-width: 899px) 96px, 300px`
   - contact: `100vw`
   - Keep explicit `width`/`height`, `decoding="async"`, `loading="lazy"` everywhere except hero card 0. Card 0 gets `fetchpriority="high"` plus `<link rel="preload" as="image" imagesrcset=... imagesizes=...>` in `<head>`.
3. **Fallbacks.** Remove the old Unsplash `data-cdn` attributes and the CDN-swap error listener in `<head>`, because all images are now local. Update `download-media.ps1` / `.sh` and `SETUP.bat` so they no longer download Unsplash photos; leave a note that the images are bundled.
4. **JavaScript dependencies.** Make sure the scripts still find their images after the switch to `<picture>`:
   - The loader's "critical images" list must still detect the 4 hero images (`$$('.deck__card img')`), and must count `load` on `currentSrc`.
   - The industries floating cursor image clones `img.currentSrc`. Verify that it still works with `<picture>`.
   - The mobile inline industry thumbnails must load (they must not sit inside a `display:none` element with `loading="lazy"`).
5. **Alt text.** Write accurate, specific alt text for each image, e.g. *"Two business leaders shaking hands across a boardroom table after signing a deal"*. Decorative duplicates (such as the floating cursor clone) get `alt=""`.
6. **Licensing note.** In `README.md` and `assets/img/PROMPTS.md`, state that the images were AI-generated with Nano Banana for Lead Base Pro, and list each file with its final prompt.

---

## 5. Gate 2: visual QA (screenshot proof required)

At **390px, 820px and 1440px** wide, screenshot each section and confirm the following:
- [ ] The hero shows **at least 3 deal / handshake / corporate-closing images** among the 4 cards. Card 0 (handshake) is sharp, loads first and appears before the loader finishes.
- [ ] Every image matches the shared colour grade and has one orange accent. Seen side by side, the set looks like a single photoshoot.
- [ ] Zero visible text, logos or watermarks inside images (check at 100% zoom).
- [ ] Every hand in every handshake and signing shot is anatomically correct.
- [ ] Text overlays (deck tags, record captions, collage chips, contact heading and form) stay readable with **≥ 4.5:1 contrast** against their scrims.
- [ ] The 16:10 mobile crops of the process images keep the subject's face and hands in frame.
- [ ] The industry thumbnails are recognisable at 64px.
- [ ] The contact background keeps the left 55% calm; the form is readable on top of it on mobile and desktop.
- [ ] Lighthouse mobile: Performance ≥ 85, **LCP < 2.5s** (the LCP element is hero card 0), CLS < 0.05, and no "properly size images" or "serve next-gen formats" warnings.
- [ ] No console errors. The loader still completes in **≤ 3.5s** on Fast 4G with 4× CPU throttling.

---

## 6. Deliverables

1. The inventory table and the model used (Gate 1).
2. All final images in `assets/img/` (optimised variants), plus `assets/img/PROMPTS.md` (prompt, model and seed per file).
3. Updated `index.html` (`<picture>` markup, new deck tags, OG tags), `js/main.js` (if loader or industry logic changed), `README.md`, download scripts and `.gitignore` (`_masters/`, `tools/node_modules/`, `.env`).
4. A contact-sheet screenshot of all generated images together (for art-direction approval), plus before/after screenshots of the hero, records, process, industries and contact sections at 390px and 1440px.
5. Lighthouse mobile scores.

Do not report the task as done until every Gate 2 box is ticked with screenshot evidence.
