const { chromium } = require('playwright');
const fs = require('fs');

async function inspectImages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const paths = [
    'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/original_farm.jpg',
    'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/media_1794732591128_995919cd.jpg',
    'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/media_1794734473709_3a1a0a2b.jpg'
  ];

  for (const p of paths) {
    const buf = fs.readFileSync(p);
    const dataUrl = 'data:image/jpeg;base64,' + buf.toString('base64');
    const dims = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await new Promise(r => img.onload = r);
      return { w: img.naturalWidth, h: img.naturalHeight };
    }, dataUrl);
    console.log(p.split('/').pop(), dims);
  }

  await browser.close();
}
inspectImages();
