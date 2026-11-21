# Lead Base Pro

B2B lead database service website. Halasuru, Bengaluru. Contact: +91 70195 76635.

**Palette (60·30·10):** Bone `#EEEAE2` · Ink `#0C0E12` · Signal orange `#FF5B1F`
**Type:** Archivo (expanded display) · Inter Tight (text) · Fraunces italic (accents)
**Tech:** GSAP 3.12.5 + ScrollTrigger + Lenis, stored locally in `js/vendor/`. No build step.

## Run
Double-click **SETUP.bat**. It downloads the photos into `assets/img/` (once) and opens http://localhost:5560.
You can also just open `index.html`. Any photo that isn't downloaded yet loads from the Unsplash CDN automatically.

## What's in it
- **Loader:** the word "leadbase" fills with moving orange liquid as the hero photos load, then the screen closes in a circle wipe (same idea as Salon Lumia).
- **Hero:** letters rise in 3D. A deck of real hotel/restaurant photos tilts with the mouse and explodes towards you as you scroll (pinned).
- **Statement:** text fills with ink as you read; the photo opens from a clipped frame; counters roll up.
- **The data:** a pinned horizontal side-scroll of six record fields. Each card swings in on a 3D hinge.
- **3D flip:** a hotel photo flips over into a sample lead record as you scroll.
- **Process:** sticky photo frame that wipes to a new image as each step takes focus.
- **Industries:** 10 rows from the sales playbook. On hover a photo follows the cursor.
- **Pricing:** 5 one-time packages that stand up in 3D, with the 30K and 60K bonuses.
- **Not just hotels:** a marquee driven by scroll speed, plus a parallax photo collage.
- **FAQ:** the five sales objections answered. **Contact:** a photo opens in a circle behind the enquiry form.

## Customise
- Prices and copy: `index.html`.
- Form: client-side only right now. Hook it up in `js/main.js` (search `TODO`).
- Photos: Unsplash (free licence). Keys and URLs are listed in `download-media.ps1`.
