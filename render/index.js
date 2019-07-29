const { ipcRenderer } = require('electron');
document.getElementById('addMusic').addEventListener('click', () => {
    ipcRenderer.send('add-music');
});
