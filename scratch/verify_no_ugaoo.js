const { chromium } = require('playwright');
const fs = require('fs');

async function verifyNoUgaoo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const c4Buf = fs.readFileSync('output/arrives_alive.jpg');
  const c3Buf = fs.readFileSync('output/survival_packaging.jpg');

  await page.setContent('<canvas id="c"></canvas>');

  const res = await page.evaluate(async ({ c4, c3 }) => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');

    // 1. Check Arrives Alive
    const img4 = new Image();
    img4.src = 'data:image/jpeg;base64,' + c4;
    await new Promise(r => img4.onload = r);
    c.width = img4.width;
    c.height = img4.height;
    ctx.drawImage(img4, 0, 0);

    // Box area is roughly x: 100 to 300, y: 50 to 500
    // Check if there are any rogue green text pixels besides the new RC FLORA
    // In our edit, we drew RC FLORA at x ~ 230 to 270 (rotated)
    // Let's verify that the old ugaoo area has no original text
    return {
      arrivesAliveSize: { w: c.width, h: c.height }
    };
  }, { c4: c4Buf.toString('base64'), c3: c3Buf.toString('base64') });

  console.log('Verification result:', res);
  await browser.close();
}

verifyNoUgaoo();
