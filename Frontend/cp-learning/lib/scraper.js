const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Spoof User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');

    // Visit the target website
    await page.goto('https://codeforces.com/contest/189/problem/A', { waitUntil: 'networkidle0' });

    // Scrape content
    const data = await page.evaluate(() => {
        // Select the specific element you want to scrape
        const problemStatement = document.querySelector('.problem-statement');
        return problemStatement ? problemStatement.innerText : null;
    });

    console.log("Scraped Data:", data);

    await browser.close();
})();
