const fs = require('fs');
const html = fs.readFileSync('output/index.html', 'utf8');

const tpIdx = html.indexOf('Tulsi Pushti');
console.log('Tulsi Pushti index:', tpIdx);
const surrounding = html.substring(tpIdx - 600, tpIdx + 600);
console.log(surrounding);
