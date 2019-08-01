const { ipcRenderer } = require("electron");
const { rendererSend, $, convertDuration } = require("./helper.js");
let allTracks,
  currentMusic,
  songName,
  musicAudio = new Audio();
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

const renderAudioPlayerHTML = (songName, duration) => {
  let musicDetail = $("musicDetail");
  let html = `
        <hr>
        <div class="row song" >
            <div class="col-8 font-weight-bold"><span>正在播放：</span><span class="song-name">${songName}</span></div>
            <div class="col-4">
                <span id="seeker">00:00</span> / <span>${convertDuration(
                  duration
                )}</span>
            </div>
        </div>
        <div class="progress">
            <div class="progress-bar" id="progressBar" role="progressbar" style="width: 0%"></div>
        </div>
  `;
  musicDetail.innerHTML = html;
};

const updateProgress = (currentTime, duration) => {
  const percent = Math.floor((currentTime / duration) * 100);
  const bar = $("progressBar");
  bar.innerText = bar.style.width = percent + "%";
};

musicAudio.addEventListener("loadedmetadata", () => {
  renderAudioPlayerHTML(songName, musicAudio.duration);
});
musicAudio.addEventListener("timeupdate", () => {
  const seeker = $("seeker");
  seeker.innerText = convertDuration(musicAudio.currentTime);
  updateProgress(musicAudio.currentTime, musicAudio.duration);
});

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
        songName = currentMusic.fileName;
        musicAudio.src = currentMusic.path;
        musicAudio.play();
        // 重置其他暂停按钮
        const resetIconElement = document.querySelector(".fa-pause");
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
    if (currentMusic && currentMusic.id === id) {
      // 删除正在播放的歌曲，应该暂停播放
      musicAudio.pause();
    }
    //  处理删除
    ipcRenderer.send("delete-track", id);
  }
});

ipcRenderer.on("getTracks", (event, tracks) => {
  renderListHTML(tracks);
  allTracks = tracks;
});
