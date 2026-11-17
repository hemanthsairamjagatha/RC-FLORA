const { chromium } = require('playwright');
const fs = require('fs');

async function findLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const buf = fs.readFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/.user_uploaded/media_1794732591128_995919cd.jpg');
  const dataUrl = 'data:image/jpeg;base64,' + buf.toString('base64');

  await page.setContent('<canvas id="c"></canvas>');

  const info = await page.evaluate(async (src) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = src;
    await new Promise(r => img.onload = r);
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    // Let's search for the green pixels of "ugaoo" on the boxes
    // Card 3 ("Survival packaging") is roughly x: 440 to 700, y: 140 to 450
    // Card 4 ("Arrives alive") is roughly x: 720 to 980, y: 140 to 450

    // In Card 4: The tall kraft cardboard box has green text "ugaoo"
    // Let's scan x: 740 to 860, y: 170 to 350 for dark green pixels
    const card4GreenPixels = [];
    const imgData4 = ctx.getImageData(720, 160, 180, 200);
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 180; x++) {
        const i = (y * 180 + x) * 4;
        const r = imgData4.data[i];
        const g = imgData4.data[i + 1];
        const b = imgData4.data[i + 2];
        // Dark green color of ugaoo logo: low r, higher g, low b (e.g., r < 80, g > 70, g > r * 1.3, b < 80)
        if (g > 60 && g > r * 1.3 && g > b * 1.3 && r < 120 && b < 100) {
          card4GreenPixels.push({ x: 720 + x, y: 160 + y, r, g, b });
        }
      }
    }

    // In Card 3: Tall center box
    const card3TallGreen = [];
    const imgData3 = ctx.getImageData(580, 160, 80, 160);
    for (let y = 0; y < 160; y++) {
      for (let x = 0; x < 80; x++) {
        const i = (y * 80 + x) * 4;
        const r = imgData3.data[i];
        const g = imgData3.data[i + 1];
        const b = imgData3.data[i + 2];
        if (g > 60 && g > r * 1.3 && g > b * 1.3 && r < 120 && b < 100) {
          card3TallGreen.push({ x: 580 + x, y: 160 + y, r, g, b });
        }
      }
    }

    // In Card 3: Left orange box
    const card3LeftGreen = [];
    const imgData3Left = ctx.getImageData(470, 200, 70, 160);
    for (let y = 0; y < 160; y++) {
      for (let x = 0; x < 70; x++) {
        const i = (y * 70 + x) * 4;
        const r = imgData3Left.data[i];
        const g = imgData3Left.data[i + 1];
        const b = imgData3Left.data[i + 2];
        if (g > 60 && g > r * 1.3 && g > b * 1.3 && r < 120 && b < 100) {
          card3LeftGreen.push({ x: 470 + x, y: 200 + y, r, g, b });
        }
      }
    }

    function getBounds(pixels) {
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
      card4: getBounds(card4GreenPixels),
      card3Tall: getBounds(card3TallGreen),
      card3Left: getBounds(card3LeftGreen)
    };
  }, dataUrl);

  console.log('Detected Logo Coordinates:', JSON.stringify(info, null, 2));
  await browser.close();
}

findLogos();
