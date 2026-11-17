const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

['Tulsi Pushti', 'Potash Meal', 'Rose Royale', 'survival_packaging', 'arrives_alive'].forEach(term => {
  const idx = html.indexOf(term);
  console.log(`\n=== ${term} (idx: ${idx}) ===`);
  if (idx !== -1) {
    // print the surrounding <img> tag
    const slice = html.substring(Math.max(0, idx - 400), Math.min(html.length, idx + 400));
    const imgMatches = slice.match(/<img[^>]+>/g);
    console.log('Images nearby:', imgMatches);
  }
});
