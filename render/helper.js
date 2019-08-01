const { ipcRenderer } = require("electron");

exports.$ = id => {
  return document.getElementById(id);
};
exports.rendererSend = (id, sendEvent, triggerEvent = "click") => {
  document.getElementById(id).addEventListener(triggerEvent, () => {
    ipcRenderer.send(sendEvent);
  });
};
exports.convertDuration = time => {
  const minutes = "0" + Math.floor(time / 60);
  const seconds = "0" + Math.floor(time - minutes * 60);
  return minutes.substr(-2) + ":" + seconds.substr(-2);
};
