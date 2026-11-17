const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

console.log('=== Checking all custom replacements in index.html ===');

// Check retail stores
const retailMatch = html.match(/<img[^>]+custom-store__card-img[^>]*>/g);
console.log('Retail store images:', retailMatch);

// Check garden services
const gsMatch = html.match(/<img[^>]+sizes="\(max-width: 768px\) 150vw, 60vw"[^>]*>/g);
console.log('Garden services image:', gsMatch);

// Check farm cards
const farmMatch = html.match(/<img[^>]+farm-card__img[^>]*>/g);
console.log('Farm card images:', farmMatch);

// Check product cards under What's New
const prodMatch = html.match(/<img[^>]+product-card__img[^>]*>/g);
console.log('Product card images (first 5):', prodMatch ? prodMatch.slice(0, 5) : 'none');
