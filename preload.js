const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openPuppeteer: () => ipcRenderer.invoke('puppeteer-open-url')
});

