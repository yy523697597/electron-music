// Modules to control application life and create native browser window
const { AppWindow } = require('./class.js');
const { app, ipcMain, dialog } = require('electron');
const { DataStore } = require('./musicData');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let myStore = new DataStore('musicList');

function createWindow() {
    // Create the browser window.
    mainWindow = new AppWindow({}, './render/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('did-finish-load', () => {
        const musicList = myStore.getTracks();
        mainWindow.send('getTracks', musicList);
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

function createAddWindow() {
    // 此处关闭窗口时要改addWindow 为 null，所以不能用 const 声明
    let addWindow = new AppWindow(
        {
            width: 500,
            height: 400,
            parent: mainWindow
        },
        './render/add.html'
    );
    addWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        addWindow = null;
    });
}

ipcMain.on('add-music', () => {
    createAddWindow();
});
ipcMain.on('select-music', event => {
    dialog.showOpenDialog(
        {
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Music', extensions: ['mp3'] }]
        },
        filePaths => {
            if (filePaths) {
                event.sender.send('selected-music-list', filePaths);
            }
        }
    );
});
ipcMain.on('add-tracks', (event, musicList) => {
    const updatedMusicList = myStore.addTracks(musicList).getTracks();
    mainWindow.send('getTracks', updatedMusicList);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
