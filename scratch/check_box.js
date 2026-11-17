const { chromium } = require('playwright');
const fs = require('fs');

async function checkCardboardBox() {
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

    // Let's find all pixels of the text on the box:
    // Notice cardboard is brownish (r > 160, g > 130, b > 70)
    // The printed green logo has:
    // - darker: r < 155, g < 155
    // - olive green: g is close to or higher than r, and g > b + 20
    const textPixels = [];
    for (let y = 10; y < 220; y++) {
      for (let x = 80; x < 145; x++) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        // Check if pixel is the green print
        // Olive green print on brown cardboard:
        if (p[1] > p[2] + 20 && p[0] < 165 && (p[1] >= p[0] - 15)) {
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

    // Also check the cardboard face width at y = 100
    // Left edge of cardboard box where color changes from wall (233, 210, 168) to cardboard
    let boxLeft = 0;
    for (let x = 60; x < 120; x++) {
      const p = ctx.getImageData(x, 100, 1, 1).data;
      if (p[0] < 225) { // wall is 233
        boxLeft = x;
        break;
      }
    }

    return {
      boxLeft,
      textBounds: { minX, maxX, minY, maxY, count: textPixels.length }
    };
  }, c4Buf.toString('base64'));

  console.log('Card 4 Cardboard Box & Text:', JSON.stringify(res, null, 2));
  await browser.close();
}

checkCardboardBox();
