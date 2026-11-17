const { chromium } = require('playwright');
const fs = require('fs');

async function analyzeCrops() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const c4Buf = fs.readFileSync('scratch/crop_card4.jpg');
  const c3Buf = fs.readFileSync('scratch/crop_card3.jpg');

  await page.setContent('<canvas id="c"></canvas>');

  const res = await page.evaluate(async ({ c4, c3 }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');

    // Load Card 4
    const img4 = new Image();
    img4.src = 'data:image/jpeg;base64,' + c4;
    await new Promise(r => img4.onload = r);

    c.width = img4.width;
    c.height = img4.height;
    ctx.drawImage(img4, 0, 0);

    // Let's inspect where the vertical text "ugaoo" is located in crop4
    // In crop4, the image width is 220, height is 310.
    // The cardboard box is in the center-left.
    // Let's find green letters:
    const data4 = ctx.getImageData(0, 0, c.width, c.height).data;
    const greenPixels4 = [];
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const r = data4[i], g = data4[i+1], b = data4[i+2];
        // Green logo text: g > 50, g > r * 1.25, g > b * 1.25, r < 110, b < 100
        // Notice cardboard is brownish (r ~ 180, g ~ 140, b ~ 90)
        // Green text is dark olive green (r ~ 50-80, g ~ 80-120, b ~ 40-70)
        if (g > 60 && g > r * 1.15 && g > b * 1.2 && r < 120 && b < 100) {
          greenPixels4.push({ x, y, r, g, b });
        }
      }
    }

    // Card 3
    const img3 = new Image();
    img3.src = 'data:image/jpeg;base64,' + c3;
    await new Promise(r => img3.onload = r);
    ctx.clearRect(0, 0, c.width, c.height);
    c.width = img3.width;
    c.height = img3.height;
    ctx.drawImage(img3, 0, 0);
    const data3 = ctx.getImageData(0, 0, c.width, c.height).data;
    const greenPixels3 = [];
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const r = data3[i], g = data3[i+1], b = data3[i+2];
        if (g > 60 && g > r * 1.15 && g > b * 1.2 && r < 120 && b < 100) {
          greenPixels3.push({ x, y, r, g, b });
        }
      }
    }

    function stats(pixels) {
      if (!pixels.length) return null;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of pixels) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      return { minX, maxX, minY, maxY, count: pixels.length };
    }

    return {
      card4Text: stats(greenPixels4),
      card3Text: stats(greenPixels3)
    };
  }, { c4: c4Buf.toString('base64'), c3: c3Buf.toString('base64') });

  console.log('Stats in crops:', res);
  await browser.close();
}

analyzeCrops();
