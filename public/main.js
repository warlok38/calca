const { app, BrowserWindow, ipcMain } = require('electron');

require('@electron/remote/main').initialize();

const storage = require('electron-json-storage');

const path = require('path');
const isDev = require('electron-is-dev');

//сюда нельзя заимпортить, поэтому дублируется из ./src/utils/constants.js
const HANDLE_FETCH_DATA = 'handle-fetch-data';
const FETCH_DATA_FROM_STORAGE = 'fetch-data-from-storage';
const HANDLE_SAVE_DATA = 'handle-save-data';
const SAVE_DATA_IN_STORAGE = 'save-data-in-storage';
const HANDLE_REMOVE_DATA = 'handle-remove-data';
const REMOVE_DATA_FROM_STORAGE = 'remove-data-from-storage';

let loadingScreen;
let itemsToTrack;
let mainWindow;

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

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
        ...prodPreferens,
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    mainWindow.webContents.on('did-finish-load', () => {
        if (loadingScreen) {
            loadingScreen.close();
        }
        mainWindow.show();
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
    if (mainWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

//////////////////////////////////////////////////////////////////////

// ipcMain methods are how we interact between the window and (this) main program

// Receives a FETCH_DATA_FROM_STORAGE from renderer
ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
    console.log(
        'Main received: FETCH_DATA_FROM_STORAGE with message:',
        message
    );
    // Get the user's itemsToTrack from storage
    // For our purposes, message = itemsToTrack array
    storage.get(message, (error, data) => {
        // if the itemsToTrack key does not yet exist in storage, data returns an empty object, so we will declare itemsToTrack to be an empty array
        itemsToTrack = JSON.stringify(data) === '{}' ? [] : data;
        if (error) {
            mainWindow.send(HANDLE_FETCH_DATA, {
                success: false,
                message: 'itemsToTrack not returned',
            });
        } else {
            // Send message back to window
            mainWindow.send(HANDLE_FETCH_DATA, {
                success: true,
                message: itemsToTrack, // do something with the data
            });
        }
    });
});

// Receive a SAVE_DATA_IN_STORAGE call from renderer
ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {
    console.log('Main received: SAVE_DATA_IN_STORAGE');
    // update the itemsToTrack array.
    itemsToTrack.push(message);
    // Save itemsToTrack to storage
    storage.set('itemsToTrack', itemsToTrack, (error) => {
        if (error) {
            console.log('We errored! What was data?');
            mainWindow.send(HANDLE_SAVE_DATA, {
                success: false,
                message: 'itemsToTrack not saved',
            });
        } else {
            // Send message back to window as 2nd arg "data"
            mainWindow.send(HANDLE_SAVE_DATA, {
                success: true,
                message: message,
            });
        }
    });
});

// Receive a REMOVE_DATA_FROM_STORAGE call from renderer
ipcMain.on(REMOVE_DATA_FROM_STORAGE, (event, message) => {
    console.log('Main Received: REMOVE_DATA_FROM_STORAGE');
    // Update the items to Track array.
    itemsToTrack = itemsToTrack.filter((item) => item !== message);
    // Save itemsToTrack to storage
    storage.set('itemsToTrack', itemsToTrack, (error) => {
        if (error) {
            console.log('We errored! What was data?');
            mainWindow.send(HANDLE_REMOVE_DATA, {
                success: false,
                message: 'itemsToTrack not saved',
            });
        } else {
            // Send new updated array to window as 2nd arg "data"
            mainWindow.send(HANDLE_REMOVE_DATA, {
                success: true,
                message: itemsToTrack,
            });
        }
    });
});
