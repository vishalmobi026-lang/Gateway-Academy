const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[pageerror] ${error.message}`);
  });

  try {
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(3000); // wait for 3 seconds
    
    await page.goto('http://localhost:5173/about');
    await page.waitForTimeout(1000);
    
    await page.goto('http://localhost:5173/courses');
    await page.waitForTimeout(1000);
    
    await page.goto('http://localhost:5173/contact');
    await page.waitForTimeout(1000);
  } catch (err) {
    console.error("Navigation error:", err);
  }

  await browser.close();
})();
