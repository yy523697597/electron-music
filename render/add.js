const { rendererSend, $ } = require('./helper.js');
const { ipcRenderer } = require('electron');
const path = require('path');

rendererSend('selectMusic', 'select-music');
let musicPathList;
// 处理收到的音乐地址
const renderListHTML = musicPathes => {
    const musicList = $('musicList');
    const noMusic = $('noMusic');
    const musicItemsHTML = musicPathes.reduce((html, music) => {
        html += `<li class="list-group-item"> ${path.basename(music)}</li>`;
        return html;
    }, '');
    musicList.innerHTML = musicItemsHTML;
    noMusic.style.display = 'none';
};

ipcRenderer.on('selected-music-list', (event, musicPathes) => {
    if (Array.isArray(musicPathes)) {
        renderListHTML(musicPathes);
        musicPathList = musicPathes;
    }
});
$('addSelectedMusic').addEventListener('click', () => {
    if (musicPathList) {
        ipcRenderer.send('add-tracks', musicPathList);
    }
});
