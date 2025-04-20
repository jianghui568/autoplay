const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    performAutomation: (url) => {
        // 添加输入验证
        if (typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error('无效的 URL 格式')
        }
        return ipcRenderer.invoke('perform-automation', url)
    }
})
