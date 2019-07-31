const { ipcRenderer } = require('electron');
const { rendererSend, $ } = require('./helper.js');
rendererSend('addMusic', 'add-music');
const renderListHTML = tracks => {
    const musicContainer = $('musicContainer');
    const musicListHTML = tracks.reduce((html, music) => {
        html += `<li class="list-group-item  d-flex justify-content-between align-items-center"> 
        <div class="col-10 d-flex align-items-center">
            <i class="fas fa-music mr-2"></i>
            <span class="col-9">${music.fileName}</span>
        </div>
        <div class="col-2"> 
            <i class="fas fa-play mr-2"></i>
            <i class="fas fa-trash-alt "></i>
        </div>
        </li>`;
        return html;
    }, '');
    musicContainer.innerHTML = musicListHTML;
};
ipcRenderer.on('getTracks', (event, tracks) => {
    renderListHTML(tracks);
});
