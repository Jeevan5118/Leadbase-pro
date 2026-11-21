import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mastersDir = path.resolve(__dirname, '../assets/img/_masters');
const outDir = path.resolve(__dirname, '../assets/img');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Configuration of target aspect ratios per slot (width / height)
const aspectRatios = {
  // Hero (4:5)
  'hero-deal-handshake': 4 / 5,
  'hero-contract-signing': 4 / 5,
  'hero-sales-win': 4 / 5,
  'hero-hospitality-supplier': 4 / 5,

  // Section 01 (4:3)
  'intro-sales-floor': 4 / 3,

  // Section 02 (4:5)
  'rec-business-name': 4 / 5,
  'rec-contact-number': 4 / 5,
  'rec-location': 4 / 5,
  'rec-website': 4 / 5,
  'rec-category': 4 / 5,
  'rec-everything-else': 4 / 5,

  // Section 03 (4:5)
  'flip-business-exterior': 4 / 5,

  // Section 04 (4:5)
  'step-tell-us': 4 / 5,
  'step-market': 4 / 5,
  'step-collect': 4 / 5,
  'step-close': 4 / 5,

  // Section 07 (varying)
  'bey-distributors': 4 / 5,
  'bey-hospitals': 1 / 1,
  'bey-real-estate': 4 / 5,
  'bey-manufacturers': 4 / 3,
  'bey-it-companies': 1 / 1,

  // Section 09 (16:9)
  'cta-deal-celebration': 16 / 9,

  // OG social image (1200x630 = 1.9048)
  'og-image': 1200 / 630,

  // Section 05 Industries (4:5)
  'ind-linen': 4 / 5,
  'ind-kitchen': 4 / 5,
  'ind-housekeeping': 4 / 5,
  'ind-furniture': 4 / 5,
  'ind-toiletries': 4 / 5,
  'ind-food': 4 / 5,
  'ind-laundry': 4 / 5,
  'ind-cctv': 4 / 5,
  'ind-interior': 4 / 5,
  'ind-software': 4 / 5,
};

async function processMaster(file) {
  const ext = path.extname(file);
  const slot = path.basename(file, ext);
  const srcPath = path.join(mastersDir, file);

  const targetRatio = aspectRatios[slot] || (4 / 5);
  console.log(`Processing: ${slot} (target ratio: ${targetRatio.toFixed(3)})`);

  const metadata = await sharp(srcPath).metadata();
  const currentRatio = metadata.width / metadata.height;

  let pipeline = sharp(srcPath);

  // Crop to exact aspect ratio if needed (centered crop)
  if (Math.abs(currentRatio - targetRatio) > 0.01) {
    let cropWidth = metadata.width;
    let cropHeight = metadata.height;

    if (currentRatio > targetRatio) {
      cropWidth = Math.round(metadata.height * targetRatio);
    } else {
      cropHeight = Math.round(metadata.width / targetRatio);
    }

    const left = Math.round((metadata.width - cropWidth) / 2);
    const top = Math.round((metadata.height - cropHeight) / 2);

    pipeline = pipeline.extract({ left, top, width: cropWidth, height: cropHeight });
  }

  const croppedBuffer = await pipeline.toBuffer();

  // Determine widths
  const standardWidths = [480, 800, 1200, 1800];
  if (slot.startsWith('cta-')) {
    standardWidths.push(2560);
  }

  for (const w of standardWidths) {
    const h = Math.round(w / targetRatio);

    // WebP (quality 78)
    const webpOut = path.join(outDir, `${slot}-${w}.webp`);
    await sharp(croppedBuffer)
      .resize(w, h, { fit: 'cover' })
      .webp({ quality: 78, effort: 5 })
      .toFile(webpOut);

    // AVIF (quality 55)
    const avifOut = path.join(outDir, `${slot}-${w}.avif`);
    await sharp(croppedBuffer)
      .resize(w, h, { fit: 'cover' })
      .avif({ quality: 55, effort: 4 })
      .toFile(avifOut);
  }

  // Also write default/un-suffixed files for backwards compatibility
  const defaultWebp = path.join(outDir, `${slot}.webp`);
  await sharp(croppedBuffer)
    .resize(Math.min(1200, metadata.width), Math.round(Math.min(1200, metadata.width) / targetRatio))
    .webp({ quality: 78 })
    .toFile(defaultWebp);

  const defaultJpg = path.join(outDir, `${slot}.jpg`);
  await sharp(croppedBuffer)
    .resize(Math.min(1200, metadata.width), Math.round(Math.min(1200, metadata.width) / targetRatio))
    .jpeg({ quality: 82 })
    .toFile(defaultJpg);

  console.log(`✓ Completed: ${slot}`);
}

async function run() {
  if (!fs.existsSync(mastersDir)) {
    console.error(`Masters directory not found: ${mastersDir}`);
    return;
  }

  const files = fs.readdirSync(mastersDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${files.length} master images in ${mastersDir}`);

  for (const file of files) {
    try {
      await processMaster(file);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  console.log('All images optimized successfully!');
}

run();
