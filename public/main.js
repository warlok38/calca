const { app, BrowserWindow } = require('electron');

require('@electron/remote/main').initialize();

const path = require('path');
const isDev = require('electron-is-dev');
let loadingScreen;
const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow(
        Object.assign({
            width: 200,
            height: 80,
            useContentSize: true,
            frame: false,
            movable: true,
        })
    );
    loadingScreen.setResizable(false);
    loadingScreen.loadURL(
        `file://${path.join(__dirname, '../src/components/Spin/index.html')}`
    );
    loadingScreen.on('closed', () => (loadingScreen = null));
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
};

function createWindow() {
    const prodPreferens = !isDev
        ? {
              autoHideMenuBar: true,
          }
        : {};

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
        },
        show: false,
        ...prodPreferens,
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    win.webContents.on('did-finish-load', () => {
        if (loadingScreen) {
            loadingScreen.close();
        }
        win.show();
    });
}

app.on('ready', () => {
    createLoadingScreen();
    createWindow();

    // setTimeout(() => {
    //     createWindow();
    // }, 2000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
