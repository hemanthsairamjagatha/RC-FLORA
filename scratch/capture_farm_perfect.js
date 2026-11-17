const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
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

  // Find by text "From Our Farm to Your Home"
  const header = await page.locator('text="From Our Farm to Your Home"').first();
  if (await header.count() > 0) {
    // Get parent section or common container
    const container = await header.locator('xpath=./ancestor::div[contains(@class, "common-container") or contains(@class, "relative")][1]');
    await container.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const buf = await container.screenshot();
    fs.writeFileSync('output/verify_farm_perfect.png', buf);
    fs.writeFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/verify_farm_perfect.png', buf);
    console.log('Successfully captured verify_farm_perfect.png!');
  } else {
    console.log('Header text not found');
  }

  await browser.close();
}

capture();
