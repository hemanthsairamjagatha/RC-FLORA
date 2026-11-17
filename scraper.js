
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const WEBSITE_URL = "https://www.ugaoo.com/";

const OUTPUT = path.join(__dirname, "output");

async function scrapeWebsite() {

    // Create output folder
    fs.mkdirSync(OUTPUT, { recursive: true });

    // Launch browser
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        viewport: {
            width: 1440,
            height: 1000
        }
    });

    try {

        console.log("Opening Ugaoo website...");

        // Open homepage
        const response = await page.goto(WEBSITE_URL, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        console.log("HTTP Status:", response?.status());

        // Wait for rendering
        await page.waitForTimeout(5000);

        console.log("Extracting HTML...");

        // Get rendered HTML
        let html = await page.content();

        // Rebrand from Ugaoo to RC FLORA
        html = html.replace(
            /<h2 class="header__heading"><a href="\/" class="header__heading-link focus-inset"><img srcset="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/logo\.png[^>]*><img srcset="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/logo\.png[^>]*><\/a><\/h2>/,
            '<h2 class="header__heading"><a href="/" class="header__heading-link focus-inset"><img srcset="rc-flora-logo.png 1x, rc-flora-logo.png 2x" src="rc-flora-logo.png" loading="eager" width="271" height="125" alt="RC FLORA" class="header__heading-logo medium-hide large-up-hide"><img srcset="rc-flora-logo.png 1x, rc-flora-logo.png 2x" src="rc-flora-logo.png" loading="eager" width="271" height="125" alt="RC FLORA" class="header__heading-logo small-hide"></a></h2>'
        );
        html = html.replace(/<title>\s*Ugaoo \| India's One-Stop Gardening Shop\s*<\/title>/i, "<title>RC FLORA | India's One-Stop Gardening Shop</title>");
        html = html.replace(/<img class="ucmp__logo" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/Group\.svg[^"]*" alt="[^"]*"[^>]*>/g, '<img class="ucmp__logo" src="rc-flora-logo.png" alt="RC FLORA" width="245" height="111" loading="lazy">');
        html = html.replace(/<img src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/Group\.svg\?height=120&amp;v=1779536181" alt="[^"]*"[^>]*>/g, '<img src="rc-flora-logo-white.png" alt="RC FLORA" height="100" loading="lazy" width="217">');
        html = html.replace(/<img class="farm-card__img" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/3_13\.webp[^>]*alt="[^"]*"[^>]*>/g, '<img class="farm-card__img" src="survival_packaging.jpg" srcset="survival_packaging.jpg 1x, survival_packaging.jpg 2x" sizes="(max-width: 639px) 79vw, (max-width: 767px) 40vw, (max-width: 1023px) 33vw, (max-width: 1535px) 27vw, 25vw" alt="Survival packaging" width="398" height="398" loading="lazy">');
        html = html.replace(/<img class="farm-card__img" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/4_9\.webp[^>]*alt="[^"]*"[^>]*>/g, '<img class="farm-card__img" src="arrives_alive.jpg" srcset="arrives_alive.jpg 1x, arrives_alive.jpg 2x" sizes="(max-width: 639px) 79vw, (max-width: 767px) 40vw, (max-width: 1023px) 33vw, (max-width: 1535px) 27vw, 25vw" alt="Arrives alive" width="398" height="398" loading="lazy">');
        html = html.replace(/<img class="product-card__img" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/1_8cb56809-055d-4da0-b2f2-ea5df77decbf\.jpg[^>]*alt="Tulsi Pushti - 1kg"[^>]*>/g, '<img class="product-card__img" src="product_tulsi_pushti.jpg" srcset="product_tulsi_pushti.jpg 1x, product_tulsi_pushti.jpg 2x" sizes="(max-width: 749px) 50vw, (max-width: 1199px) 34vw, 25vw" alt="Tulsi Pushti - 1kg" width="600" height="600" loading="lazy">');
        html = html.replace(/<img class="product-card__img" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/1_2_4cbf1ac6-bbc1-4fff-ba26-33475255ebe4\.jpg[^>]*alt="Potash Meal - 1kg"[^>]*>/g, '<img class="product-card__img" src="product_potash_meal.jpg" srcset="product_potash_meal.jpg 1x, product_potash_meal.jpg 2x" sizes="(max-width: 749px) 50vw, (max-width: 1199px) 34vw, 25vw" alt="Potash Meal - 1kg" width="600" height="600" loading="lazy">');
        html = html.replace(/<img class="product-card__img" src="\/\/www\.ugaoo\.com\/cdn\/shop\/files\/1_1_6a7059bd-efd7-4140-ab74-a0fa22afcfe6\.jpg[^>]*alt="Rose Royale Fertiliser\s*-\s*500gm"[^>]*>/g, '<img class="product-card__img" src="product_rose_royale.jpg" srcset="product_rose_royale.jpg 1x, product_rose_royale.jpg 2x" sizes="(max-width: 749px) 50vw, (max-width: 1199px) 34vw, 25vw" alt="Rose Royale Fertiliser - 500gm" width="600" height="600" loading="lazy">');
        html = html.replace(/alt=["']Ugaoo["']/gi, 'alt="RC FLORA"');
        html = html.replace(/alt=["']ugaoo["']/gi, 'alt="RC FLORA"');
        html = html.replace(/<meta property="og:site_name" content="[^"]*">/g, '<meta property="og:site_name" content="RC FLORA">');
        html = html.replace(/<meta property="og:title" content="[^"]*">/g, '<meta property="og:title" content="RC FLORA | India\'s One-Stop Gardening Shop">');
        html = html.replace(/>What's New at Ugaoo</g, ">What's New at RC FLORA<");
        html = html.replace(/>Ugaoo vs the Rest</g, ">RC FLORA vs the Rest<");
        html = html.replace(/>Grown by experts on Ugaoo farms</g, ">Grown by experts on RC FLORA farms<");
        html = html.replace(/>Find Your Nearest Ugaoo</g, ">Find Your Nearest RC FLORA<");
        html = html.replace(/>UGAOO Retail Store</g, ">RC FLORA Retail Store<");
        html = html.replace(/Welcome to Ugaoo,/g, "Welcome to RC FLORA,");

        fs.writeFileSync(
            path.join(OUTPUT, "index.html"),
            html
        );

        console.log("Extracting resources...");

        // Collect public resource references
        const data = await page.evaluate(() => {

            const images = [...document.images].map(img => {
                let alt = img.alt || "";
                if (alt.toLowerCase().includes("ugaoo")) {
                    alt = alt.replace(/ugaoo/gi, "RC FLORA");
                }
                let src = img.currentSrc || img.src;
                if (src.includes("logo.png")) {
                    src = "rc-flora-logo.png";
                    alt = "RC FLORA";
                } else if (src.includes("Group.svg")) {
                    src = "rc-flora-logo-white.png";
                    alt = "RC FLORA";
                }
                return { src, alt };
            });

            const css = [
                ...document.querySelectorAll(
                    'link[rel="stylesheet"]'
                )
            ].map(item => item.href);

            const js = [
                ...document.querySelectorAll("script[src]")
            ].map(item => item.src);

            const links = [
                ...document.querySelectorAll("a[href]")
            ].map(item => ({
                text: item.innerText.trim(),
                href: item.href
            }));

            return {
                title: document.title,
                images,
                css,
                js,
                links
            };
        });

        // Save JSON
        fs.writeFileSync(
            path.join(OUTPUT, "resources.json"),
            JSON.stringify(data, null, 2)
        );

        // Save screenshot
        await page.screenshot({
            path: path.join(OUTPUT, "screenshot.png"),
            fullPage: true
        });

        console.log("Scraping completed!");
        console.log("HTML:", "output/index.html");
        console.log("Resources:", "output/resources.json");
        console.log("Screenshot:", "output/screenshot.png");

        console.log("Images:", data.images.length);
        console.log("CSS files:", data.css.length);
        console.log("JS files:", data.js.length);

    } catch (error) {

        console.log("Error:", error.message);

    } finally {

        await browser.close();

    }
}

scrapeWebsite();
