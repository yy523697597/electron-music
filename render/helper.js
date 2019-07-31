const { ipcRenderer } = require('electron');

exports.$ = id => {
    return document.getElementById(id);
};
exports.rendererSend = (id, sendEvent, triggerEvent = 'click') => {
    document.getElementById(id).addEventListener(triggerEvent, () => {
        ipcRenderer.send(sendEvent);
    });
};
