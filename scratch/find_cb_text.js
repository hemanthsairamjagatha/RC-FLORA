const { chromium } = require('playwright');
const fs = require('fs');

async function findCardboardText() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const c4Buf = fs.readFileSync('scratch/crop_card4.jpg');

  await page.setContent('<canvas id="c"></canvas>');

  const res = await page.evaluate(async (c4) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + c4;
    await new Promise(r => img.onload = r);
    c.width = img.width;
    c.height = img.height;
    ctx.drawImage(img, 0, 0);

    // In crop4, cardboard box front panel:
    // Let's sample colors across x from 30 to 110 at y = 100
    const samples = [];
    for (let x = 40; x <= 120; x += 5) {
      const p = ctx.getImageData(x, 100, 1, 1).data;
      samples.push({ x, rgb: `${p[0]},${p[1]},${p[2]}` });
    }

    // Find any pixels where text is printed on cardboard
    // Cardboard base color is around (190, 150, 100) or similar
    // The printed text is dark olive green (around 60-90, 80-120, 50-70)
    const textPixels = [];
    for (let y = 30; y < 220; y++) {
      for (let x = 40; x < 120; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        // Text is darker than cardboard (cardboard r > 150, text r < 120, g < 130)
        // and has green tint: g > r * 1.05
        if (p[0] < 125 && p[1] < 130 && p[1] > p[0] * 1.05 && p[1] > p[2]) {
          textPixels.push({ x, y, r: p[0], g: p[1], b: p[2] });
        }
      }
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of textPixels) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    // Also get average cardboard color around x: 80, y: 220 (clean cardboard)
    const cb = ctx.getImageData(70, 220, 1, 1).data;

    return {
      samplesAt100: samples,
      detectedText: { minX, maxX, minY, maxY, count: textPixels.length },
      cardboardColor: `${cb[0]},${cb[1]},${cb[2]}`
    };
  }, c4Buf.toString('base64'));

  console.log('Card 4 Analysis:', JSON.stringify(res, null, 2));
  await browser.close();
}

findCardboardText();
