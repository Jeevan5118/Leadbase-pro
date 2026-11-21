import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');
const js = fs.readFileSync('js/main.js', 'utf8');
const readme = fs.existsSync('README.md') ? fs.readFileSync('README.md', 'utf8') : '';

console.log('================ 1. CONTENT AUDIT ================');
const oldPhone = (html + css + js + readme).match(/63633|27097/gi) || [];
console.log('Old phone (63633 27097) count:', oldPhone.length);

const oldBrand = (html + css + js + readme).match(/akshara|enterprises/gi) || [];
console.log('Old brand (Akshara Enterprises) count:', oldBrand.length);

const kicker = (html + css + js).match(/hero__kicker/gi) || [];
console.log('Hero kicker count:', kicker.length);

const cursor = (html + css + js).match(/id=["']cursor["']|\.cursor\b/gi) || [];
console.log('Custom cursor dot count:', cursor.length);

const floatImg = (html + css + js).match(/indFloat|ind__float/gi) || [];
console.log('Floating image glitch count:', floatImg.length);

const notSelling = html.match(/not selling phone numbers/gi) || [];
console.log('"Not selling phone numbers" count:', notSelling.length);

const correctPhone = html.match(/70195\s*76635/gi) || [];
console.log('Correct phone (+91 70195 76635) count in HTML:', correctPhone.length);

const officialEmail = (html + readme).match(/connect@leadbasepro\.online/gi) || [];
console.log('Official email (connect@leadbasepro.online) count:', officialEmail.length);

const dummyEmails = (html + css + js + readme).match(/[a-zA-Z0-9._%+-]+@(?!leadbasepro\.online)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi) || [];
console.log('Dummy / unauthorized emails count:', dummyEmails.length);

console.log('\n================ 2. IMAGE INTEGRITY ================');
const imgRegex = /(?:src|srcset)=["']([^"']+)["']/g;
let m;
let missing = [];
let totalSrc = 0;
while ((m = imgRegex.exec(html)) !== null) {
  const parts = m[1].split(',');
  for (const part of parts) {
    const src = part.trim().split(/\s+/)[0];
    if (src.startsWith('assets/img/')) {
      totalSrc++;
      if (!fs.existsSync(src)) missing.push(src);
    }
  }
}
console.log('Total local image references checked:', totalSrc);
console.log('Missing images count:', missing.length);

console.log('\n================ 3. RESPONSIVE SIZING & CONTRAST ================');
const footerWord = css.includes('.footer__word') && css.includes('clamp(24px, 8.2vw, 130px)');
console.log('Footer word scalable fluid font (clamp 24px-130px):', footerWord);

const heroTitleMobile = css.includes('font-size: clamp(28px, calc((100vw - 2 * var(--pad)) / 11.2), 92px)');
console.log('Hero title safe mobile font scaling:', heroTitleMobile);

const colorSchemeLight = html.includes('color-scheme') && css.includes('color-scheme: only light');
console.log('Light color-scheme lock to prevent forced dark invert:', colorSchemeLight);

const processFrameCompact = css.includes('max-width: 480px') && css.includes('height: clamp(380px, 56vh, 520px)');
console.log('Process sticky frame compact sizing:', processFrameCompact);

const processReliableTrigger = js.includes('onEnter: () => activate(i)') && js.includes('onEnterBack: () => activate(i)');
console.log('Process step swap reliable bidirectional triggering:', processReliableTrigger);

const allPassed = (
  oldPhone.length === 0 &&
  oldBrand.length === 0 &&
  kicker.length === 0 &&
  cursor.length === 0 &&
  floatImg.length === 0 &&
  notSelling.length === 0 &&
  missing.length === 0 &&
  officialEmail.length >= 4 &&
  dummyEmails.length === 0 &&
  footerWord &&
  heroTitleMobile &&
  colorSchemeLight &&
  processFrameCompact &&
  processReliableTrigger
);

console.log('\n================ FINAL RESULT ================');
if (allPassed) {
  console.log('>>> ALL 12 AUDIT CHECKS PASSED WITH 100% SUCCESS! <<<');
} else {
  console.error('>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
