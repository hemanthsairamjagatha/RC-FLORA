const { chromium } = require('playwright');
const fs = require('fs');

async function drawGrids() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const c4Buf = fs.readFileSync('scratch/crop_card4.jpg');
  const c3Buf = fs.readFileSync('scratch/crop_card3.jpg');

  await page.setContent('<canvas id="c"></canvas>');

  await page.evaluate(async ({ c4, c3 }) => {
    function makeGrid(dataUrl, filename) {
      const c = document.getElementById('c');
      const ctx = c.getContext('2d');
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + dataUrl;
      return new Promise(resolve => {
        img.onload = () => {
          c.width = img.width;
          c.height = img.height;
          ctx.drawImage(img, 0, 0);

          ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
          ctx.lineWidth = 1;
          ctx.fillStyle = '#ffff00';
          ctx.font = '9px monospace';

          for (let x = 0; x < c.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, c.height);
            ctx.stroke();
            ctx.fillText(x.toString(), x + 1, 10);
          }
          for (let y = 0; y < c.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(c.width, y);
            ctx.stroke();
            ctx.fillText(y.toString(), 2, y - 2);
          }
          resolve(c.toDataURL('image/png'));
        };
      });
    }

    const g4 = await makeGrid(c4, 'grid4');
    const g3 = await makeGrid(c3, 'grid3');
    window.__g4 = g4;
    window.__g3 = g3;
  }, { c4: c4Buf.toString('base64'), c3: c3Buf.toString('base64') });

  const g4 = await page.evaluate(() => window.__g4);
  const g3 = await page.evaluate(() => window.__g3);

  fs.writeFileSync('scratch/grid_card4.png', Buffer.from(g4.replace(/^data:image\/png;base64,/, ''), 'base64'));
  fs.writeFileSync('scratch/grid_card3.png', Buffer.from(g3.replace(/^data:image\/png;base64,/, ''), 'base64'));

  console.log('Saved grid_card4.png and grid_card3.png');
  await browser.close();
}

drawGrids();
