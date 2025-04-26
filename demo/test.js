import puppeteer from 'puppeteer';

async function waitForElementByPolling(page, selector,  interval = 2000) {
  const start = Date.now();

  while (true) {
    const count = await page.evaluate((sel) => {
      return document.querySelectorAll(sel).length;
    }, selector);

    if (count > 0) {
      console.log(`✅ 元素 "${selector}" 已加载，数量：${count}`);
      return;
    }

    console.log(`⏳ 等待 "${selector}"，当前数量：${count}`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`❌ 超时：元素 "${selector}" 未加载或为空`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto('https://www.neup8d.com:9010/', { waitUntil: 'domcontentloaded' });


  await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待2s，防止后面元素获取不到
  // 2. 等待元素加载（推荐使用显式等待）
  await page.waitForSelector('input[placeholder="账号"]', { timeout: 5000 });

  // 3. 通过placeholder定位账号输入框并设置值
  const accountInput = await page.$('input[placeholder="账号"]');
  if (accountInput) {
    await page.type('input[placeholder="账号"]', 'shuke0001');
    console.log('账号输入框已设置值：shuke0001');
  } else {
    console.error('账号输入框未找到');
  }
  // 4. 通过placeholder定位密码输入框并设置值
  const passwordInput = await page.$('input[placeholder="密码"]');
  if (passwordInput) {
    await page.type('input[placeholder="密码"]', 'shuke123');
    console.log('密码输入框已设置值：shuke123');
  } else {
    console.error('密码输入框未找到');
  }

  await loadElementWithText('span', '登录', 20, 10);

  await loadElementWithText('div', '彩票', 20, 5);

  await loadElementWithText('div', '进入游戏', 20, 5);

  await loadElementWithText('span', '腾讯分分彩', 30, 5);



  await page.waitForSelector('span.close.icon-close', { timeout: 10000 });
  await page.hover('span.close.icon-close');
  await page.click('span.close.icon-close');


  console.log('🌐 页面加载完毕，等待元素出现...');

  try {
    await waitForElementByPolling(page, '.recently-list-body li');
    console.log('🎉 元素已加载，继续操作');
    // TODO: 继续后续操作
  } catch (err) {
    console.error(err.message);
  }

  // await browser.close();
})();


async function loadElementWithText(element,text, waitTime, clickTime= 0) {
  await page.waitForSelector(element,  {
    text: text,
    timeout: waitTime * 1000
  });
  await page.hover(element, { text: text });
  await page.click(element,  {
    text: text,
    timeout: clickTime * 1000
  });
}
