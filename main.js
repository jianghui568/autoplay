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
        await page.waitForSelector('#kw', { timeout: 5000 })
        await page.type('#kw', '自动化测试成功')
        await page.click('#su')
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
