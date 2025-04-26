/**
 * 定时检测元素是否存在
 * @param {Page} page - Puppeteer页面实例
 * @param {string} selector - 元素选择器
 * @param {Object} [options] - 配置选项
 * @param {number} [options.interval=3000] - 检测间隔（毫秒，默认3秒）
 * @param {number} [options.maxRetries=10] - 最大重试次数（默认10次）
 * @returns {Promise<boolean>} - 元素是否存在
 */
async function pollElementExists(page, selector, options = {}) {
    const { interval = 3000, maxRetries = 10 } = options;
    let retries = 0;

    const check = async () => {
        try {
            const element = await page.$(selector);
            if (element) return true;

            if (retries++ >= maxRetries) {
                console.log(`检测超时，最大重试次数：${maxRetries}`);
                return false;
            }

            await new Promise(res => setTimeout(res, interval));
            return check(); // 递归调用
        } catch (error) {
            console.error('检测失败:', error);
            return false;
        }
    };

    return check();
}
