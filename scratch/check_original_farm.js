const fs = require('fs');

// Check git status or scraper.js to find what the original image URLs were
const scraper = fs.readFileSync('scraper.js', 'utf8');
const urls = scraper.match(/https?:\/\/[^'\"\s]+/g) || [];
console.log('URLs in scraper:', urls.filter(u => u.includes('cdn/shop')));

// Also check original_farm.jpg or media_1794732591128_995919cd.jpg
const origExists = fs.existsSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/original_farm.jpg');
console.log('original_farm.jpg exists in artifact dir:', origExists);

const userUpload = 'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/media_1794732591128_995919cd.jpg';
console.log('media_1794732591128_995919cd.jpg exists:', fs.existsSync(userUpload));
