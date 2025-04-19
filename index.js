const openBtn = document.getElementById('openBtn');

openBtn.addEventListener('click', async () => {
    openBtn.disabled = true;
    openBtn.textContent = '正在启动中...';

    try {
        await window.electronAPI.openPuppeteer();
    } catch (err) {
        alert('启动浏览器失败，请查看控制台');
    }

    openBtn.disabled = false;
    openBtn.textContent = '打开网页';
});
