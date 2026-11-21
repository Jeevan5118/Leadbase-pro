import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const regex = /(?:src|srcset)=["']([^"']+)["']/g;
let m;
const missing = [];
let checkedCount = 0;

while ((m = regex.exec(html)) !== null) {
  const parts = m[1].split(',');
  for (const part of parts) {
    const src = part.trim().split(/\s+/)[0];
    if (src.startsWith('assets/img/')) {
      checkedCount++;
      if (!fs.existsSync(src)) {
        missing.push(src);
      }
    }
  }
}

console.log(`Checked ${checkedCount} image source paths.`);
if (missing.length === 0) {
  console.log('PASS: 100% of image paths in index.html exist on disk!');
} else {
  console.error('FAIL: Missing images:', Array.from(new Set(missing)));
  process.exit(1);
}
