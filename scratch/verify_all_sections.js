const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifySections() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const htmlPath = 'file:///' + path.resolve('output/index.html').replace(/\\/g, '/');
  console.log('Loading page:', htmlPath);

  await page.goto(htmlPath, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 1. Header Screenshot
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: 'output/verify_header.png' });
    console.log('Captured verify_header.png');
  }

  // 2. What's New at RC FLORA
  const whatsNew = await page.$('#shopify-section-template--28247255580804__collection_section_Gjya4x');
  if (whatsNew) {
    await whatsNew.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await whatsNew.screenshot({ path: 'output/verify_whats_new.png' });
    console.log('Captured verify_whats_new.png');
  }

  // 3. From Our Farm to Your Home
  const farm = await page.$('.farm-section, [id*="farm"]');
  if (farm) {
    await farm.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await farm.screenshot({ path: 'output/verify_farm.png' });
    console.log('Captured verify_farm.png');
  }

  // 4. Retail Stores
  const stores = await page.$('.custom-store__inner, [id*="store"]');
  if (stores) {
    await stores.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await stores.screenshot({ path: 'output/verify_stores.png' });
    console.log('Captured verify_stores.png');
  }

  // 5. Garden Services
  const gs = await page.$('.garden-service-section');
  if (gs) {
    await gs.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await gs.screenshot({ path: 'output/verify_garden_services.png' });
    console.log('Captured verify_garden_services.png');
  }

  // 6. Footer
  const footer = await page.$('footer');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await footer.screenshot({ path: 'output/verify_footer.png' });
    console.log('Captured verify_footer.png');
  }

  await browser.close();
  console.log('Verification completed!');
}

verifySections();
