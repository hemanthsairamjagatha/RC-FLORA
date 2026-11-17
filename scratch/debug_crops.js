const { chromium } = require('playwright');
const fs = require('fs');

async function debugCrops() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const buf = fs.readFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/media_1794732591128_995919cd.jpg');
  const dataUrl = 'data:image/jpeg;base64,' + buf.toString('base64');

  await page.setContent('<canvas id="c"></canvas>');

  const crops = await page.evaluate(async (src) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = src;
    await new Promise(r => img.onload = r);

    // Crop Card 4 box area: x: 700 to 920, y: 140 to 450
    c.width = 220;
    c.height = 310;
    ctx.drawImage(img, 710, 140, 220, 310, 0, 0, 220, 310);
    const card4Crop = c.toDataURL('image/jpeg');

    // Crop Card 3 box area: x: 450 to 680, y: 140 to 450
    c.width = 230;
    c.height = 310;
    ctx.drawImage(img, 460, 140, 230, 310, 0, 0, 230, 310);
    const card3Crop = c.toDataURL('image/jpeg');

    return { card4Crop, card3Crop };
  }, dataUrl);

  fs.writeFileSync('scratch/crop_card4.jpg', Buffer.from(crops.card4Crop.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('scratch/crop_card3.jpg', Buffer.from(crops.card3Crop.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  console.log('Saved debug crops to scratch/');
  await browser.close();
}

debugCrops();
