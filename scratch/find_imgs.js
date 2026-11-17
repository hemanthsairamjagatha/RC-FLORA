const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

['Tulsi Pushti', 'Potash Meal', 'Rose Royale'].forEach(term => {
  let idx = 0;
  while ((idx = html.indexOf(term, idx)) !== -1) {
    const start = Math.max(0, idx - 1500);
    const end = Math.min(html.length, idx + 1500);
    const block = html.substring(start, end);
    const imgs = block.match(/<img[^>]+>/g);
    console.log(`Term ${term} at ${idx}:`, imgs ? imgs.length : 0);
    if (imgs) {
      imgs.forEach(img => {
        if (img.includes(term) || img.includes('product_') || img.includes('cdn/shop')) {
          console.log('   IMG:', img.substring(0, 200));
        }
      });
    }
    idx += term.length;
  }
});
