const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function processAllImages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  const inputDir = 'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/';

  // Load the plant icon base64 for drawing
  const iconBase64 = fs.readFileSync('output/plant-icon.png').toString('base64');
  const iconWhiteBase64 = fs.readFileSync('output/plant-icon-white.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Playfair+Display:wght@700;800&family=DM+Serif+Display&display=swap" rel="stylesheet">
    </head>
    <body>
      <canvas id="c"></canvas>
      <img id="iconGreen" src="data:image/png;base64,${iconBase64}">
      <img id="iconWhite" src="data:image/png;base64,${iconWhiteBase64}">
    </body>
    </html>
  `);

  await page.waitForTimeout(1000);

  // Helper to load and draw image
  async function editImage(file, drawFn) {
    const buf = fs.readFileSync(path.join(inputDir, file));
    const dataUrl = 'data:image/jpeg;base64,' + buf.toString('base64');
    
    return await page.evaluate(async ({ dataUrl, drawFnStr }) => {
      const c = document.getElementById('c');
      const ctx = c.getContext('2d');
      const iconGreen = document.getElementById('iconGreen');
      const iconWhite = document.getElementById('iconWhite');

      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => {
        if (img.complete) r();
        else img.onload = r;
      });

      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const fn = new Function('ctx', 'c', 'iconGreen', 'iconWhite', drawFnStr);
      fn(ctx, c, iconGreen, iconWhite);

      return c.toDataURL('image/jpeg', 0.95);
    }, { dataUrl, drawFnStr: drawFn });
  }

  // -------------------------------------------------------------
  // 1. Image 4: Garden Services
  // -------------------------------------------------------------
  console.log('Processing Image 4: Garden Services...');
  const res4 = await editImage('media_1794732636844_9e9286e1.jpg', `
    // Cover "Ugaoo" in heading with yellow background
    ctx.fillStyle = '#ffd82b';
    ctx.fillRect(728, 162, 105, 36);

    // Draw "RC FLORA" in heading
    ctx.fillStyle = '#0a2318';
    ctx.font = 'bold 24px "DM Serif Display", "Playfair Display", Georgia, serif';
    ctx.fillText('RC FLORA', 732, 189);

    // Cover "ugaoo" on the white pot
    const potColor = ctx.getImageData(255, 370, 1, 1).data;
    ctx.fillStyle = 'rgb(' + potColor[0] + ',' + potColor[1] + ',' + potColor[2] + ')';
    ctx.beginPath();
    ctx.ellipse(258, 385, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Miniature RC FLORA on pot
    ctx.drawImage(iconGreen, 252, 375, 12, 10);
    ctx.fillStyle = '#0a4c36';
    ctx.font = 'bold 8px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 242, 393);
  `);
  fs.writeFileSync('output/rebranded_garden_services.jpg', Buffer.from(res4.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  // -------------------------------------------------------------
  // 2. Image 3: Retail Stores
  // -------------------------------------------------------------
  console.log('Processing Image 3: Retail Stores...');
  const res3 = await editImage('media_1794732625733_2f8c1b86.jpg', `
    // Card 1: Janakpuri Store signboard
    const greenP = ctx.getImageData(90, 245, 1, 1).data;
    ctx.fillStyle = 'rgb(' + greenP[0] + ',' + greenP[1] + ',' + greenP[2] + ')';
    ctx.fillRect(40, 185, 200, 68);

    // Draw 3D-styled white RC FLORA signage
    ctx.drawImage(iconWhite, 55, 195, 24, 22);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = '900 25px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 87, 218);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('RC FLORA', 85, 216);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '700 12px "Outfit", sans-serif';
    ctx.fillText('PLANT BOUTIQUE', 85, 235);

    // Card 2: Pacific Mall rooftop signboard
    const greenP2 = ctx.getImageData(370, 310, 1, 1).data;
    ctx.fillStyle = 'rgb(' + greenP2[0] + ',' + greenP2[1] + ',' + greenP2[2] + ')';
    ctx.fillRect(336, 305, 78, 30);

    ctx.drawImage(iconWhite, 342, 311, 12, 11);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 357, 323);
  `);
  fs.writeFileSync('output/rebranded_retail_stores.jpg', Buffer.from(res3.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  // -------------------------------------------------------------
  // 3. Image 2: Fertilizer Products
  // -------------------------------------------------------------
  console.log('Processing Image 2: Fertilizers...');
  const res2 = await editImage('media_1794732605002_b5eff8ad.jpg', `
    // Tulsi Pushti pouch
    const p1 = ctx.getImageData(114, 407, 1, 1).data;
    ctx.fillStyle = 'rgb(' + p1[0] + ',' + p1[1] + ',' + p1[2] + ')';
    ctx.fillRect(98, 408, 32, 15);
    ctx.drawImage(iconWhite, 108, 409, 7, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 101, 421);

    // Potash Meal pouch
    const p2 = ctx.getImageData(350, 345, 1, 1).data;
    ctx.fillStyle = 'rgb(' + p2[0] + ',' + p2[1] + ',' + p2[2] + ')';
    ctx.fillRect(334, 346, 32, 15);
    ctx.drawImage(iconWhite, 344, 347, 7, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 337, 359);

    // Rose Royale pouch
    const p3 = ctx.getImageData(585, 415, 1, 1).data;
    ctx.fillStyle = 'rgb(' + p3[0] + ',' + p3[1] + ',' + p3[2] + ')';
    ctx.fillRect(570, 417, 32, 15);
    ctx.drawImage(iconWhite, 580, 418, 7, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 573, 430);
  `);
  fs.writeFileSync('output/rebranded_fertilizers.jpg', Buffer.from(res2.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  // -------------------------------------------------------------
  // 4. Image 1: Farm Packaging
  // -------------------------------------------------------------
  console.log('Processing Image 1: Farm Packaging...');
  const res1 = await editImage('media_1794732591128_995919cd.jpg', `
    // Survival Packaging box 1
    const boxCol1 = ctx.getImageData(495, 240, 1, 1).data;
    ctx.fillStyle = 'rgb(' + boxCol1[0] + ',' + boxCol1[1] + ',' + boxCol1[2] + ')';
    ctx.fillRect(490, 248, 25, 68);

    ctx.save();
    ctx.translate(508, 310);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0a4c36';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 0, 0);
    ctx.restore();

    // Survival Packaging box 2 (tall center box)
    const boxCol2 = ctx.getImageData(610, 190, 1, 1).data;
    ctx.fillStyle = 'rgb(' + boxCol2[0] + ',' + boxCol2[1] + ',' + boxCol2[2] + ')';
    ctx.fillRect(598, 195, 24, 82);

    ctx.save();
    ctx.translate(616, 272);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(iconGreen, -6, -14, 12, 10);
    ctx.fillStyle = '#0a4c36';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 10, 0);
    ctx.restore();

    // Arrives alive tall box
    const boxCol3 = ctx.getImageData(795, 220, 1, 1).data;
    ctx.fillStyle = 'rgb(' + boxCol3[0] + ',' + boxCol3[1] + ',' + boxCol3[2] + ')';
    ctx.fillRect(783, 228, 28, 88);

    ctx.save();
    ctx.translate(803, 310);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(iconGreen, -7, -16, 14, 12);
    ctx.fillStyle = '#0a4c36';
    ctx.font = '900 15px "Outfit", sans-serif';
    ctx.fillText('RC FLORA', 12, 0);
    ctx.restore();
  `);
  fs.writeFileSync('output/rebranded_farm.jpg', Buffer.from(res1.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  console.log('All 4 images successfully rebranded and saved!');
  await browser.close();
}

processAllImages();
