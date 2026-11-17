const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderWithSetContent() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Read html and replace relative image paths with base64 data URLs for 100% reliable local rendering
  let html = fs.readFileSync('output/index.html', 'utf8');

  // Embed local images as base64
  const imgFiles = [
    'survival_packaging.jpg',
    'arrives_alive.jpg',
    'rc-flora-logo.png',
    'rc-flora-logo-white.png',
    'product_tulsi_pushti.jpg',
    'product_potash_meal.jpg',
    'product_rose_royale.jpg',
    'store_janakpuri.jpg',
    'store_pacific_mall.jpg',
    'garden_services_pot.jpg'
  ];

  for (const f of imgFiles) {
    if (fs.existsSync('output/' + f)) {
      const b64 = fs.readFileSync('output/' + f).toString('base64');
      const ext = f.endsWith('.png') ? 'png' : 'jpeg';
      const dataUri = `data:image/${ext};base64,${b64}`;
      // Replace all occurrences of src="f", srcset="... f ..."
      const regex = new RegExp(`(?<=src=["']|srcset=["'][^"']*)${f}`, 'g');
      html = html.replace(regex, dataUri);
    }
  }

  // Remove external script tags to avoid any execution hangs
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  await page.setContent(html);
  await page.waitForTimeout(1000);

  // Capture the farm cards section:
  // In the DOM, find elements with class "farm-card"
  const farmCard = await page.$('.farm-card');
  if (farmCard) {
    // Find parent container with background
    const farmContainer = await page.evaluateHandle(() => {
      const card = document.querySelector('.farm-card');
      let parent = card;
      while (parent && parent.parentElement) {
        if (parent.classList.contains('common-container') || parent.style.backgroundColor || parent.classList.contains('relative')) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return card.parentElement;
    });

    const buf = await farmContainer.asElement().screenshot();
    fs.writeFileSync('output/verify_farm_perfect.png', buf);
    fs.writeFileSync('C:/Users/battu/.gemini/antigravity/brain/847baf13-e275-489f-94a5-8593dcb8e0ec/verify_farm_perfect.png', buf);
    console.log('Successfully captured verify_farm_perfect.png with setContent!');
  } else {
    console.log('farmCard not found');
  }

  await browser.close();
}

renderWithSetContent();
