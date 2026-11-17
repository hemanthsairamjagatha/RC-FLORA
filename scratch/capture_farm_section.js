const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureFarmSection() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  const htmlPath = 'file:///' + path.resolve('output/index.html').replace(/\\/g, '/');
  await page.goto(htmlPath, { waitUntil: 'commit', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const farm = await page.$('#shopify-section-template--28247255580804__rich_text_Fjrh3j, .farm-section, [class*="farm"]');
  if (farm) {
    await farm.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const farmBuf = await farm.screenshot();
    fs.writeFileSync('output/verify_farm_fixed.png', farmBuf);
    fs.writeFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/verify_farm_fixed.png', farmBuf);
    console.log('Captured verify_farm_fixed.png!');
  } else {
    console.log('Farm section not found');
  }

  await browser.close();
}

captureFarmSection();
