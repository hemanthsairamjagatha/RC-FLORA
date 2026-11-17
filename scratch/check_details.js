const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

console.log('--- Checking Retail Stores in HTML ---');
const janak = html.indexOf('Janakpuri');
console.log('Janakpuri index:', janak);
if (janak !== -1) {
  console.log(html.substring(janak - 300, janak + 300));
}

console.log('--- Checking Garden Services Image in HTML ---');
const gs = html.indexOf('Garden services by');
console.log('Garden services index:', gs);
if (gs !== -1) {
  console.log(html.substring(gs - 500, gs + 500));
}

console.log('--- Checking Footer in HTML ---');
const footer = html.indexOf('<footer');
console.log('Footer index:', footer);
if (footer !== -1) {
  console.log(html.substring(footer, footer + 1500));
}
