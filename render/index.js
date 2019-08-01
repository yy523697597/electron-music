const { ipcRenderer } = require("electron");
const { rendererSend, $ } = require("./helper.js");
rendererSend("addMusic", "add-music");
const renderListHTML = tracks => {
  const musicContainer = $("musicContainer");
  const musicListHTML = tracks.reduce((html, music) => {
    html += `<li class="list-group-item row  d-flex justify-content-between align-items-center"> 
        <div class="col-10 d-flex align-items-center">
            <i class="fas fa-music mr-2"></i>
            <span class="col-9">${music.fileName}</span>
        </div>
        <div class="col-2"> 
            <i class="fas fa-play mr-2" data-id="${music.id}"></i>
            <i class="fas fa-trash-alt "  data-id="${music.id}"></i>
        </div>
        </li>`;
    return html;
  }, "");
  musicContainer.innerHTML = musicListHTML;
};
let allTracks;

ipcRenderer.on("getTracks", (event, tracks) => {
  renderListHTML(tracks);
  allTracks = tracks;
});
let musicAudio = new Audio();
let currentMusic;
$("musicContainer").addEventListener("click", event => {
  event.preventDefault();
  const { dataset, classList } = event.target;
  const id = dataset && dataset.id;
  if (id && classList.contains("fa-play")) {
    if (currentMusic && currentMusic.id === id) {
      // 继续播放原来的音乐
      musicAudio.play();
    } else {
      //  播放音乐
      currentMusic = allTracks.find(music => id === music.id);
      if (currentMusic) {
        musicAudio.src = currentMusic.path;
        musicAudio.play();
        // 重置其他暂停按钮
        const resetIconElement = document.querySelector("fa-pause");
        if (resetIconElement) {
          resetIconElement.classList.replace("fa-pause", "fa-play");
        }
      }
    }
    classList.replace("fa-play", "fa-pause");
  } else if (id && classList.contains("fa-pause")) {
    //  处理暂停
    musicAudio.pause();
    classList.replace("fa-pause", "fa-play");
  } else if (id && classList.contains("fa-trash-alt")) {
    //  处理删除
    ipcRenderer.send("delete-track", id);
  }
});
