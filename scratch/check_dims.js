const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkDims() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const files = [
    'media_1794730884217_712e89c2.jpg',
    'media_1794730904120_ca5a1047.jpg',
    'media_1794732591128_995919cd.jpg',
    'media_1794732605002_b5eff8ad.jpg',
    'media_1794732625733_2f8c1b86.jpg',
    'media_1794732636844_9e9286e1.jpg'
  ];
  
  const dir = 'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/';
  
  for (const f of files) {
    const buf = fs.readFileSync(path.join(dir, f));
    const dataUrl = 'data:image/jpeg;base64,' + buf.toString('base64');
    const dims = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await new Promise(r => img.onload = r);
      return { w: img.naturalWidth, h: img.naturalHeight };
    }, dataUrl);
    console.log(f, dims);
  }
  await browser.close();
}
checkDims();
