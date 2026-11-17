const fs = require('fs');

const html = fs.readFileSync('output/index.html', 'utf8');

console.log('--- Logo Occurrences ---');
const logoRegex = /<img[^>]+(?:logo|rc-flora|ugaoo)[^>]*>/gi;
let m;
let count = 0;
while ((m = logoRegex.exec(html)) !== null && count < 10) {
  console.log(`[${m.index}]`, m[0].substring(0, 200));
  count++;
}

console.log('\n--- Garden Services ---');
const gs = html.match(/.{0,50}Garden services by.{0,50}/gi);
console.log(gs);

console.log('\n--- Survival Packaging img ---');
const sp = html.match(/.{0,50}survival_packaging.{0,50}/gi);
console.log(sp ? sp.slice(0, 3) : 'none');

console.log('\n--- Tulsi Pushti img ---');
const tp = html.match(/.{0,50}Tulsi Pushti.{0,100}/gi);
console.log(tp ? tp.slice(0, 3) : 'none');

console.log('\n--- Retail stores ---');
const rs = html.match(/.{0,50}Janakpuri.{0,100}/gi);
console.log(rs ? rs.slice(0, 3) : 'none');
