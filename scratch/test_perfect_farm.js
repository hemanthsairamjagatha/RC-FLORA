const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPerfectFarmCards() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  const inputDir = 'C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/';
  const iconBase64 = fs.readFileSync('output/plant-icon.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
    </head>
    <body>
      <canvas id="c"></canvas>
      <img id="iconGreen" src="data:image/png;base64,${iconBase64}">
    </body>
    </html>
  `);

  await page.waitForTimeout(1000);

  const origBuf = fs.readFileSync(path.join(inputDir, 'media_1794732591128_995919cd.jpg'));
  const origDataUrl = 'data:image/jpeg;base64,' + origBuf.toString('base64');

  const result = await page.evaluate(async ({ origDataUrl }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const iconGreen = document.getElementById('iconGreen');

    const img = new Image();
    img.src = origDataUrl;
    await new Promise(r => img.onload = r);

    const full = document.createElement('canvas');
    full.width = img.naturalWidth;
    full.height = img.naturalHeight;
    const fctx = full.getContext('2d');
    fctx.drawImage(img, 0, 0);

    // =========================================================================
    // 1. CARD 4 ("Arrives alive"): Tall kraft cardboard box
    // =========================================================================
    // Cardboard box face: x: 795 to 865, y: 155 to 355
    const cbTopColor = fctx.getImageData(820, 150, 1, 1).data;
    const cbMidColor = fctx.getImageData(820, 250, 1, 1).data;
    const cbBotColor = fctx.getImageData(820, 360, 1, 1).data;

    const cbGrad = fctx.createLinearGradient(0, 160, 0, 355);
    cbGrad.addColorStop(0, `rgb(${cbTopColor[0]}, ${cbTopColor[1]}, ${cbTopColor[2]})`);
    cbGrad.addColorStop(0.5, `rgb(${cbMidColor[0]}, ${cbMidColor[1]}, ${cbMidColor[2]})`);
    cbGrad.addColorStop(1, `rgb(${cbBotColor[0]}, ${cbBotColor[1]}, ${cbBotColor[2]})`);

    fctx.fillStyle = cbGrad;
    fctx.fillRect(795, 158, 68, 194);

    // Subtle cardboard texture
    const noiseData = fctx.getImageData(795, 158, 68, 194);
    for (let i = 0; i < noiseData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 8;
      noiseData.data[i] = Math.min(255, Math.max(0, noiseData.data[i] + noise));
      noiseData.data[i+1] = Math.min(255, Math.max(0, noiseData.data[i+1] + noise));
      noiseData.data[i+2] = Math.min(255, Math.max(0, noiseData.data[i+2] + noise));
    }
    fctx.putImageData(noiseData, 795, 158);

    // Draw "RC FLORA" vertical on Card 4 box (centered on the box face: x = 830)
    fctx.save();
    fctx.translate(833, 335);
    fctx.rotate(-Math.PI / 2);
    fctx.drawImage(iconGreen, -10, -26, 20, 18);
    fctx.fillStyle = '#1c5237';
    fctx.font = '900 24px "Outfit", sans-serif';
    fctx.fillText('RC FLORA', 18, -10);
    fctx.restore();


    // =========================================================================
    // 2. CARD 3 ("Survival packaging"): Orange boxes & tubes
    // =========================================================================
    // A. Left orange box: x: 476 to 535, y: 195 to 330
    const leftBoxTop = fctx.getImageData(505, 195, 1, 1).data;
    const leftBoxBot = fctx.getImageData(505, 330, 1, 1).data;
    const leftGrad = fctx.createLinearGradient(0, 200, 0, 330);
    leftGrad.addColorStop(0, `rgb(${leftBoxTop[0]}, ${leftBoxTop[1]}, ${leftBoxTop[2]})`);
    leftGrad.addColorStop(1, `rgb(${leftBoxBot[0]}, ${leftBoxBot[1]}, ${leftBoxBot[2]})`);
    fctx.fillStyle = leftGrad;
    fctx.fillRect(476, 200, 56, 125);

    // Draw RC FLORA on left orange box
    fctx.save();
    fctx.translate(510, 312);
    fctx.rotate(-Math.PI / 2);
    fctx.drawImage(iconGreen, -6, -16, 14, 12);
    fctx.fillStyle = '#0a4c36';
    fctx.font = 'bold 14px "Outfit", sans-serif';
    fctx.fillText('RC FLORA', 12, -5);
    fctx.restore();

    // B. Center tall orange box: x: 575 to 645, y: 165 to 300
    const tallBoxTop = fctx.getImageData(610, 160, 1, 1).data;
    const tallBoxBot = fctx.getImageData(610, 300, 1, 1).data;
    const tallGrad = fctx.createLinearGradient(0, 165, 0, 300);
    tallGrad.addColorStop(0, `rgb(${tallBoxTop[0]}, ${tallBoxTop[1]}, ${tallBoxTop[2]})`);
    tallGrad.addColorStop(1, `rgb(${tallBoxBot[0]}, ${tallBoxBot[1]}, ${tallBoxBot[2]})`);
    fctx.fillStyle = tallGrad;
    fctx.fillRect(576, 165, 68, 132);

    // Draw RC FLORA on center tall orange box
    fctx.save();
    fctx.translate(616, 285);
    fctx.rotate(-Math.PI / 2);
    fctx.drawImage(iconGreen, -8, -20, 18, 16);
    fctx.fillStyle = '#0a4c36';
    fctx.font = '900 18px "Outfit", sans-serif';
    fctx.fillText('RC FLORA', 15, -6);
    fctx.restore();

    // C. Cylinder in front of center box: x: 530 to 565, y: 270 to 310
    const cylColor = fctx.getImageData(545, 260, 1, 1).data;
    fctx.fillStyle = `rgb(${cylColor[0]}, ${cylColor[1]}, ${cylColor[2]})`;
    fctx.fillRect(530, 275, 32, 18);
    fctx.fillStyle = '#0a4c36';
    fctx.font = 'bold 6px "Outfit", sans-serif';
    fctx.fillText('RC FLORA', 532, 287);

    // D. Small square box "Aloe there!": x: 550 to 585, y: 300 to 320
    const aloeColor = fctx.getImageData(565, 295, 1, 1).data;
    fctx.fillStyle = `rgb(${aloeColor[0]}, ${aloeColor[1]}, ${aloeColor[2]})`;
    fctx.fillRect(552, 297, 28, 12);
    fctx.fillStyle = '#0a4c36';
    fctx.font = 'bold 5px "Outfit", sans-serif';
    fctx.fillText('RC FLORA', 553, 306);

    // =========================================================================
    // Crop Card 3 and Card 4 individually at 600x600
    // =========================================================================
    // Card 3 ("Survival packaging"):
    c.width = 600;
    c.height = 600;
    ctx.drawImage(full, 436, 92, 276, 276, 0, 0, 600, 600);
    const card3DataUrl = c.toDataURL('image/jpeg', 0.95);

    // Card 4 ("Arrives alive"):
    ctx.clearRect(0, 0, 600, 600);
    ctx.drawImage(full, 718, 92, 276, 276, 0, 0, 600, 600);
    const card4DataUrl = c.toDataURL('image/jpeg', 0.95);

    // Both cards together for preview
    c.width = 560;
    c.height = 300;
    ctx.drawImage(full, 436, 92, 560, 276, 0, 0, 560, 300);
    const bothCardsUrl = c.toDataURL('image/jpeg', 0.95);

    return { card3DataUrl, card4DataUrl, bothCardsUrl };
  }, { origDataUrl });

  fs.writeFileSync('output/survival_packaging.jpg', Buffer.from(result.card3DataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('survival_packaging.jpg', Buffer.from(result.card3DataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  fs.writeFileSync('output/arrives_alive.jpg', Buffer.from(result.card4DataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('arrives_alive.jpg', Buffer.from(result.card4DataUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  fs.writeFileSync('scratch/perfect_farm_preview.jpg', Buffer.from(result.bothCardsUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));
  fs.writeFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/perfect_farm_preview.jpg', Buffer.from(result.bothCardsUrl.replace(/^data:image\/jpeg;base64,/, ''), 'base64'));

  console.log('Saved perfect survival_packaging.jpg and arrives_alive.jpg!');
  await browser.close();
}

testPerfectFarmCards();
