import fs from 'fs';

const files = ['index.html', 'css/styles.css', 'js/main.js', 'README.md'];
const patterns = {
  oldPhone: /63633|27097/i,
  oldBrand: /akshara|enterprises/i,
  heroKicker: /hero__kicker/i,
  cursor: /id=["']cursor["']|\.cursor\b/,
  floatingImg: /indFloat|ind__float/
};

const results = {};
for (const [k, p] of Object.entries(patterns)) {
  results[k] = 0;
  for (const f of files) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      const matches = content.match(new RegExp(p.source, 'gi'));
      if (matches) results[k] += matches.length;
    }
  }
}

console.log(JSON.stringify(results, null, 2));
const allZero = Object.values(results).every(v => v === 0);
if (!allZero) {
  console.error('Audit failed: some unwanted patterns found!');
  process.exit(1);
} else {
  console.log('AUDIT PASSED: All unwanted patterns are 0!');
}
