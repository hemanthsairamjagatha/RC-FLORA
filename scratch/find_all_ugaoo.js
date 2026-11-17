const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

const regex = /ugaoo/gi;
let match;
const matches = [];
while ((match = regex.exec(html)) !== null) {
  matches.push({
    index: match.index,
    snippet: html.substring(Math.max(0, match.index - 50), Math.min(html.length, match.index + 50)).replace(/\n/g, ' ')
  });
}

console.log('Total occurrences of ugaoo in output/index.html:', matches.length);
console.log('First 20 occurrences:');
matches.slice(0, 20).forEach((m, i) => console.log(`${i+1}. [${m.index}]: ${m.snippet}`));

// Group occurrences by type: cdn/shop URL, internal text, links, attributes
let cdnCount = 0;
let userFacingText = [];
matches.forEach(m => {
  if (m.snippet.includes('cdn/shop') || m.snippet.includes('//www.ugaoo.com')) {
    cdnCount++;
  } else {
    userFacingText.push(m);
  }
});

console.log('\nOccurrences in CDN/Shop URLs:', cdnCount);
console.log('User-facing or non-CDN occurrences count:', userFacingText.length);
userFacingText.forEach((m, i) => console.log(`${i+1}. [${m.index}]: ${m.snippet}`));
