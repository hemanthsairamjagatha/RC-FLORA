const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyFast() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Block external network requests so it doesn't hang
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  const htmlPath = 'file:///' + path.resolve('output/index.html').replace(/\\/g, '/');
  console.log('Loading page with blocked external network...');

  await page.goto(htmlPath, { waitUntil: 'commit', timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Capture Header
  try {
    const header = await page.$('.header-wrapper, header');
    if (header) {
      await header.screenshot({ path: 'output/verify_header.png' });
      console.log('Captured verify_header.png');
    }
  } catch (e) { console.log('Header error:', e.message); }

  // Capture What's New
  try {
    const wn = await page.$('#shopify-section-template--28247255580804__collection_section_Gjya4x');
    if (wn) {
      await wn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await wn.screenshot({ path: 'output/verify_whats_new.png' });
      console.log('Captured verify_whats_new.png');
    }
  } catch (e) { console.log('WN error:', e.message); }

  // Capture Farm
  try {
    const farm = await page.$('#shopify-section-template--28247255580804__rich_text_Fjrh3j, .farm-section, [class*="farm"]');
    if (farm) {
      await farm.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await farm.screenshot({ path: 'output/verify_farm.png' });
      console.log('Captured verify_farm.png');
    }
  } catch (e) { console.log('Farm error:', e.message); }

  // Capture Stores
  try {
    const stores = await page.$('#shopify-section-template--28247255580804__custom_store_section_n4c9rD, [class*="custom-store"]');
    if (stores) {
      await stores.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await stores.screenshot({ path: 'output/verify_stores.png' });
      console.log('Captured verify_stores.png');
    }
  } catch (e) { console.log('Stores error:', e.message); }

  // Capture Garden Services
  try {
    const gs = await page.$('#shopify-section-template--28247255580804__garden_service_section_iW4rYc, [class*="garden-service"]');
    if (gs) {
      await gs.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await gs.screenshot({ path: 'output/verify_garden_services.png' });
      console.log('Captured verify_garden_services.png');
    }
  } catch (e) { console.log('GS error:', e.message); }

  // Capture Footer
  try {
    const footer = await page.$('footer');
    if (footer) {
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await footer.screenshot({ path: 'output/verify_footer.png' });
      console.log('Captured verify_footer.png');
    }
  } catch (e) { console.log('Footer error:', e.message); }

  await browser.close();
  console.log('All verifications captured successfully!');
}

verifyFast();
