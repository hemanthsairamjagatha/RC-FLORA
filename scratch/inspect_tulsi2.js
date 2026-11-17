const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

const tpIdx = html.indexOf('Tulsi Pushti');
console.log(html.substring(tpIdx, tpIdx + 1500));
