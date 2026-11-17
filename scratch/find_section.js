const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');
const idx = html.indexOf('From Our Farm to Your Home');
const before = html.substring(Math.max(0, idx - 1500), idx);
const matches = before.match(/<div[^>]*id="[^"]*"|<section[^>]*id="[^"]*"/gi);
console.log('Matches:', matches);
