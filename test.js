import puppeteer from 'puppeteer';

// 自定义等待函数
async function waitForElementByPolling(page, selector, timeout = 15000, interval = 500) {
    const start = Date.now();

    while ((Date.now() - start) < timeout) {
        const exists = await page.evaluate((sel) => {
            return document.querySelector(sel) !== null;
        }, selector);

        if (exists) {
            console.log(`✅ 元素 "${selector}" 已加载`);
            return;
        }

        console.log(`⏳ 正在等待 "${selector}"...`);
        await page.waitForTimeout(interval);
    }

    throw new Error(`❌ 超时：元素 "${selector}" 未加载`);
}

// 主流程
(async () => {
    const browser = await puppeteer.launch({
        headless: false, // 打开界面
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto('https://www.neup8d.com:9010/', { waitUntil: 'domcontentloaded' });

    console.log('🌐 页面加载完毕，等待元素出现...');

    try {
        await waitForElementByPolling(page, '.ball-history-list-SSC', 15000, 1000);
        console.log('🎉 现在可以执行后续操作了');
        // TODO: 继续你的自动化逻辑
    } catch (err) {
        console.error(err.message);
    }

    // browser.close(); // 根据需求是否自动关闭
})();
