import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../assets/img/_masters/hero-deal-handshake.jpg');
const outputPath = path.resolve(__dirname, '../assets/img/og-image.jpg');

async function createOgImage() {
  const meta = await sharp(inputPath).metadata();
  console.log(`Original dimensions: ${meta.width}x${meta.height}`);

  // Target OG is 1200x630 (aspect ratio 1.9048)
  const targetW = 1200;
  const targetH = 630;

  await sharp(inputPath)
    .resize(targetW, targetH, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  console.log(`✓ OG Image created: ${outputPath}`);
}

createOgImage().catch(console.error);
