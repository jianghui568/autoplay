const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const puppeteer = require('puppeteer-core')

let mainWindow
let browser = null

app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1')


// 注册 IPC 处理器（必须放在最外层）
ipcMain.handle('perform-automation', async (_, url) => {
    try {
        const page = (await browser.pages())[0]
        await page.goto(url, { waitUntil: 'networkidle2' })

        // 检测元素是否存在（配置：每3秒检测，最多检测10次）
        // const isExist = await pollElementExists(page, '.ball-history-list-SSC', {
        //     interval: 3000,
        //     maxRetries: 1000
        // });

        // await page.waitForSelector('#kw', { timeout: 5000 })
        // await page.type('#kw', '自动化测试成功')
        // await page.click('#su')

// 2. 持续检测元素是否存在
        const detectAndProcess = async () => {
            try {
                // 等待容器元素加载
                const container = await page.waitForSelector('.ball-history-list-SSC', {
                    timeout: 1000 // 5秒检测间隔
                });

                // 3. 元素存在时启动定时任务
                if (container) {
                    console.log('检测到历史记录容器，启动定时采集...');
                    setInterval(async () => {
                        // 4. 遍历所有li元素
                        const listItems = await container.$$eval('li', (items) =>
                            items.map(item => {
                                // 提取期号
                                const qihao = item.querySelector('.qihao')?.textContent?.trim() || '无';

                                // 提取所有奖项号
                                const jianghao = Array.from(
                                    item.querySelectorAll('.jianghaoList .jianghao'),
                                    el => el.textContent.trim()
                                ).join(', ');

                                return { qihao, jianghao };
                            })
                        );

                        // 5. 打印结果
                        console.log('----- 当前记录 -----', new Date().toLocaleString());
                        listItems.forEach((item, index) => {
                            console.log(`第${index + 1}条: 
              期号: ${item.qihao}
              奖号: ${item.jianghao}`);
                        });
                    }, 3000); // 3秒间隔
                }
            } catch (err) {
                // 6. 异常处理
                console.log('元素未找到，5秒后重试...');
                setTimeout(detectAndProcess, 1000);
            }
        };
        await  detectAndProcess()
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
})



async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    // 关键：先加载空白页确保调试服务启动
    await mainWindow.loadURL('about:blank')

    // 等待调试服务就绪
    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
        browser = await puppeteer.connect({
            browserURL: 'http://127.0.0.1:9222',
            defaultViewport: null,
            timeout: 10000
        })
        console.log('Puppeteer 连接成功')
    } catch (error) {
        console.error('连接失败:', error)
        app.quit()
    }

    // 加载实际页面
    await mainWindow.loadFile('index.html')
}



app.whenReady().then(createWindow)



////////// 业务一下



function consoleHistory() {

    setInterval(() => {
        const listItems = document.querySelectorAll('.ball-history-list-SSC li');

// 遍历每个 li
        listItems.forEach(li => {
            // 提取期号
            const qihao = li.querySelector('.qihao').textContent.trim();
            // 提取所有奖号并拼接成字符串
            const numbers = Array.from(li.querySelectorAll('.jianghaoList .jianghao'))
                .map(span => span.textContent.trim())
                .join(',');
            // 按格式输出
            console.log(`${qihao} ： ${numbers}`);
        });
    }, 2000);
}

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
