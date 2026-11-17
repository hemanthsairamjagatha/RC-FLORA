const { chromium } = require('playwright');
const fs = require('fs');

async function checkCard3() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const c3Buf = fs.readFileSync('scratch/crop_card3.jpg');

  await page.setContent('<canvas id="c"></canvas>');

  const res = await page.evaluate(async (c3) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + c3;
    await new Promise(r => img.onload = r);
    c.width = img.width;
    c.height = img.height;
    ctx.drawImage(img, 0, 0);

    // In crop3 (w: 230, h: 310):
    // Box 1 (orange tall box on left): x ~ 10 to 60, y ~ 40 to 180
    // Box 2 (orange tall box on center/right): x ~ 120 to 180, y ~ 20 to 180
    // Round cylinders / small box in center: x ~ 60 to 130, y ~ 100 to 220

    // Let's sample colors of the tall center orange box:
    // It's orange/terracotta: r > 160, g ~ 90-120, b ~ 40-70
    // The green text is dark green (r < 70, g > 60, b < 70)
    const tallBoxText = [];
    for (let y = 30; y < 190; y++) {
      for (let x = 120; x < 180; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        // Dark green print on orange box
        if (p[0] < 90 && p[1] > 50 && p[1] > p[0] && p[2] < 80) {
          tallBoxText.push({ x, y, r: p[0], g: p[1], b: p[2] });
        }
      }
    }

    // Left orange box:
    const leftBoxText = [];
    for (let y = 60; y < 190; y++) {
      for (let x = 15; x < 65; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        if (p[0] < 90 && p[1] > 50 && p[1] > p[0] && p[2] < 80) {
          leftBoxText.push({ x, y, r: p[0], g: p[1], b: p[2] });
        }
      }
    }

    // Cylinders / small box:
    const cylinderText = [];
    for (let y = 130; y < 200; y++) {
      for (let x = 65; x < 120; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        if (p[0] < 90 && p[1] > 50 && p[1] > p[0] && p[2] < 80) {
          cylinderText.push({ x, y, r: p[0], g: p[1], b: p[2] });
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
      tallBoxText: stats(tallBoxText),
      leftBoxText: stats(leftBoxText),
      cylinderText: stats(cylinderText)
    };
  }, c3Buf.toString('base64'));

  console.log('Card 3 Analysis:', JSON.stringify(res, null, 2));
  await browser.close();
}

checkCard3();
