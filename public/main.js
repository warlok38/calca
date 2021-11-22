const { app, BrowserWindow, Menu } = require('electron');

require('@electron/remote/main').initialize();

const path = require('path');
const isDev = require('electron-is-dev');

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
        ...prodPreferens,
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
}

app.on('ready', createWindow);

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
