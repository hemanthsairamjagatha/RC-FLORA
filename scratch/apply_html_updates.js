const fs = require('fs');

let html = fs.readFileSync('output/index.html', 'utf8');

// 1. Janakpuri store image
const janakOld = '<img class="custom-store__card-img" alt="Janakpuri" width="600" height="660" loading="lazy" src="//www.ugaoo.com/cdn/shop/files/s11.webp?v=1779443774&amp;width=600">';
const janakNew = '<img class="custom-store__card-img" alt="Janakpuri" width="600" height="660" loading="lazy" src="store_janakpuri.jpg" srcset="store_janakpuri.jpg 1x, store_janakpuri.jpg 2x">';

if (html.includes(janakOld)) {
  html = html.replace(janakOld, janakNew);
  console.log('Janakpuri store image replaced successfully');
} else {
  console.log('Janakpuri store image old pattern not found, trying regex');
  html = html.replace(/<img class="custom-store__card-img" alt="Janakpuri"[^>]+>/, janakNew);
}

// 2. Pacific Mall store image
const pacificOld = '<img class="custom-store__card-img" alt="Pacific Mall ( Tilak Nagar )" width="600" height="660" loading="lazy" src="//www.ugaoo.com/cdn/shop/files/s12.webp?v=1779443789&amp;width=600">';
const pacificNew = '<img class="custom-store__card-img" alt="Pacific Mall ( Tilak Nagar )" width="600" height="660" loading="lazy" src="store_pacific_mall.jpg" srcset="store_pacific_mall.jpg 1x, store_pacific_mall.jpg 2x">';

if (html.includes(pacificOld)) {
  html = html.replace(pacificOld, pacificNew);
  console.log('Pacific Mall store image replaced successfully');
} else {
  console.log('Pacific Mall store image old pattern not found, trying regex');
  html = html.replace(/<img class="custom-store__card-img" alt="Pacific Mall \( Tilak Nagar \)"[^>]+>/, pacificNew);
}

// 3. Garden Services pot image
const gsOldRegex = /<img src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/rectangle_26\.webp[^>]+>/;
const gsNew = '<img src="garden_services_pot.jpg" srcset="garden_services_pot.jpg 1x, garden_services_pot.jpg 2x" sizes="(max-width: 768px) 150vw, 60vw" alt="Garden services by RC FLORA" loading="lazy" width="820" height="650">';

if (gsOldRegex.test(html)) {
  html = html.replace(gsOldRegex, gsNew);
  console.log('Garden services pot image replaced successfully');
} else {
  console.log('Garden services pot image regex did not match');
}

// 4. Footer email
html = html.replace(/mailto:support@ugaoo\.com/g, 'mailto:support@rcflora.com');
html = html.replace(/Email: support@ugaoo\.com/g, 'Email: support@rcflora.com');
console.log('Footer email updated');

fs.writeFileSync('output/index.html', html, 'utf8');
console.log('Updated output/index.html successfully');
