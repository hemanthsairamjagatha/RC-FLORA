const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateRemainingImages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  const inputDir = 'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/';
  const iconBase64 = fs.readFileSync('output/plant-icon.png').toString('base64');
  const iconWhiteBase64 = fs.readFileSync('output/plant-icon-white.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Playfair+Display:wght@700;800&family=DM+Serif+Display&display=swap" rel="stylesheet">
    </head>
    <body>
      <canvas id="c"></canvas>
      <img id="iconGreen" src="data:image/png;base64,${iconBase64}">
      <img id="iconWhite" src="data:image/png;base64,${iconWhiteBase64}">
    </body>
    </html>
  `);

  await page.waitForTimeout(1000);

  // 1. Store Janakpuri Card
  console.log('Generating Store Janakpuri...');
  const retailBuf = fs.readFileSync(path.join(inputDir, 'media_1794732625733_2f8c1b86.jpg'));
  const retailDataUrl = 'data:image/jpeg;base64,' + retailBuf.toString('base64');

  const janakpuriData = await page.evaluate(async ({ dataUrl }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const iconWhite = document.getElementById('iconWhite');

    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);

    // Janakpuri card bounding box in media_1794732625733_2f8c1b86.jpg:
    // Card 1 starts at x: 40, y: 170, width: 226, height: 215 (roughly card aspect)
    // First, let's draw the full image to an offscreen canvas to edit the signboard
    const off = document.createElement('canvas');
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    // Rebrand Janakpuri signboard on offscreen canvas
    // Signboard area: x: 42, y: 195, w: 190, h: 58
    const bgCol = offCtx.getImageData(80, 240, 1, 1).data;
    offCtx.fillStyle = 'rgb(' + bgCol[0] + ',' + bgCol[1] + ',' + bgCol[2] + ')';
    offCtx.fillRect(40, 195, 185, 54);

    // Draw white sprout icon + RC FLORA
    offCtx.drawImage(iconWhite, 52, 204, 22, 20);
    // drop shadow
    offCtx.fillStyle = 'rgba(0,0,0,0.6)';
    offCtx.font = '900 24px "Outfit", sans-serif';
    offCtx.fillText('RC FLORA', 82, 225);
    // crisp white text
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText('RC FLORA', 80, 223);

    // subtitle
    offCtx.fillStyle = 'rgba(255,255,255,0.85)';
    offCtx.font = '700 11px "Outfit", sans-serif';
    offCtx.fillText('PLANT BOUTIQUE', 81, 239);

    // Now crop Card 1 cleanly (aspect ~ 600x660)
    // Card 1 content in screenshot: x: 40, y: 172, w: 224, h: 225
    c.width = 600;
    c.height = 660;
    ctx.drawImage(off, 40, 172, 224, 225, 0, 0, 600, 660);

    return c.toDataURL('image/jpeg', 0.95);
  }, { dataUrl: retailDataUrl });

  fs.writeFileSync('output/store_janakpuri.jpg', Buffer.from(janakpuriData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('store_janakpuri.jpg', Buffer.from(janakpuriData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  // 2. Store Pacific Mall Card
  console.log('Generating Store Pacific Mall...');
  const pacificData = await page.evaluate(async ({ dataUrl }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const iconWhite = document.getElementById('iconWhite');

    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);

    const off = document.createElement('canvas');
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    // Rebrand Pacific mall rooftop sign: x: 336, y: 305, w: 78, h: 30
    const bgCol = offCtx.getImageData(370, 310, 1, 1).data;
    offCtx.fillStyle = 'rgb(' + bgCol[0] + ',' + bgCol[1] + ',' + bgCol[2] + ')';
    offCtx.fillRect(336, 305, 80, 30);

    offCtx.drawImage(iconWhite, 342, 311, 12, 11);
    offCtx.fillStyle = '#ffffff';
    offCtx.font = '800 11px "Outfit", sans-serif';
    offCtx.fillText('RC FLORA', 357, 323);

    // Crop Card 2 (Pacific Mall): x: 272, y: 172, w: 224, h: 225
    c.width = 600;
    c.height = 660;
    ctx.drawImage(off, 272, 172, 224, 225, 0, 0, 600, 660);

    return c.toDataURL('image/jpeg', 0.95);
  }, { dataUrl: retailDataUrl });

  fs.writeFileSync('output/store_pacific_mall.jpg', Buffer.from(pacificData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('store_pacific_mall.jpg', Buffer.from(pacificData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  // 3. Garden Services Pot Photo (Left image of Garden services)
  console.log('Generating Garden Services Photo...');
  const gsBuf = fs.readFileSync(path.join(inputDir, 'media_1794732636844_9e9286e1.jpg'));
  const gsDataUrl = 'data:image/jpeg;base64,' + gsBuf.toString('base64');

  const gsPhotoData = await page.evaluate(async ({ dataUrl }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const iconGreen = document.getElementById('iconGreen');

    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);

    const off = document.createElement('canvas');
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    // Cover "ugaoo" on white pot
    // Pot coordinates in media_1794732636844_9e9286e1.jpg: x ~ 258, y ~ 385
    const potColor = offCtx.getImageData(255, 370, 1, 1).data;
    offCtx.fillStyle = 'rgb(' + potColor[0] + ',' + potColor[1] + ',' + potColor[2] + ')';
    offCtx.beginPath();
    offCtx.ellipse(258, 385, 22, 10, 0, 0, Math.PI * 2);
    offCtx.fill();

    // Rebrand with miniature RC FLORA + Green Sprout
    offCtx.drawImage(iconGreen, 252, 374, 12, 10);
    offCtx.fillStyle = '#0a4c36';
    offCtx.font = 'bold 8px "Outfit", sans-serif';
    offCtx.fillText('RC FLORA', 242, 393);

    // Crop the photo card on the left:
    // Left card bounds in media_1794732636844_9e9286e1.jpg: x: 26, y: 78, w: 526, h: 360
    c.width = 820;
    c.height = 650;
    ctx.drawImage(off, 26, 78, 526, 360, 0, 0, 820, 650);

    return c.toDataURL('image/jpeg', 0.95);
  }, { dataUrl: gsDataUrl });

  fs.writeFileSync('output/garden_services_pot.jpg', Buffer.from(gsPhotoData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('garden_services_pot.jpg', Buffer.from(gsPhotoData.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  console.log('All remaining store & garden images generated successfully!');
  await browser.close();
}

generateRemainingImages();
