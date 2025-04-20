document.getElementById('loginBtn').addEventListener('click', () => {
    const url = document.getElementById('url').value;
    if (url) {
        window.electronAPI.loginSuccess(url);
    }
});
