const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const downloadPath = path.resolve('./wp_export_xml');
  if (!fs.existsSync(downloadPath)){
      fs.mkdirSync(downloadPath);
  }
  
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  console.log("Logging in...");
  await page.goto('https://deviajepormarruecos.com/wp-login.php');
  await page.type('#user_login', 'tonwy');
  await page.type('#user_pass', 'BJ4?!WzQl6s8nKj_');
  await Promise.all([
    page.click('#wp-submit'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  console.log("Navigating to export page...");
  await page.goto('https://deviajepormarruecos.com/wp-admin/export.php');
  
  console.log("Triggering experiencias export...");
  await page.evaluate(() => {
    const radio = document.querySelector('input[value="experiencias"]');
    if (radio) radio.click();
  });
  
  await page.click('#submit');
  
  console.log("Waiting 10 seconds for download to complete...");
  await new Promise(r => setTimeout(r, 10000));
  
  await browser.close();
  
  const files = fs.readdirSync(downloadPath);
  console.log("Downloaded files:", files);
  console.log("Done downloading export.");
})();
