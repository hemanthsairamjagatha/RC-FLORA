const fs = require('fs');

console.log('Exists in root:');
['rc-flora-logo.png', 'rc-flora-logo-white.png', 'survival_packaging.jpg', 'arrives_alive.jpg', 'product_tulsi_pushti.jpg', 'product_potash_meal.jpg', 'product_rose_royale.jpg', 'rebranded_retail_stores.jpg', 'rebranded_garden_services.jpg'].forEach(f => {
  console.log(f, fs.existsSync(f), fs.existsSync('output/' + f));
});
