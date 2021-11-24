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

const FETCH_DATA = 'get-data-from-storage';
const SEND_DATA = 'send-data-to-storage';
const DELETE_DATA = 'delete-data-from-storage';

const FETCH_DATA_HANDLER = 'fetch-data-handler';
const SEND_DATA_HANDLER = 'send-data-handler';
const DELETE_DATA_HANDLER = 'delete-data-handler';

const DROP_DATABASE = 'drop-database';

let loadingScreen;
let itemsToTrack;
let mainWindow;

let dataList;

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
    // update the itemsToTrack array.
    itemsToTrack.push(message);
    // Save itemsToTrack to storage
    storage.set('itemsToTrack', itemsToTrack, (error) => {
        if (error) {
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
    // Update the items to Track array.
    itemsToTrack = itemsToTrack.filter((item) => item !== message);
    // Save itemsToTrack to storage
    storage.set('itemsToTrack', itemsToTrack, (error) => {
        if (error) {
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

///////NEW/////NEW/////NEW/////////NEW////////////////

ipcMain.on(FETCH_DATA, (event, list) => {
    storage.get(list, (error, data) => {
        dataList = JSON.stringify(data) === '{}' ? [] : data;
        if (error) {
            console.error('Error in FETCH_DATA. dataList: ', dataList);
        } else {
            console.log('FETCH_DATA data: ', dataList);
            mainWindow.send(FETCH_DATA_HANDLER, {
                success: true,
                list: dataList,
            });
        }
    });
});

ipcMain.on(SEND_DATA, (event, values) => {
    dataList.push(values);
    storage.set('dataList', dataList, (error) => {
        if (error) {
            console.error('Error in SEND_DATA. Values: ', values);
        } else {
            mainWindow.send(SEND_DATA_HANDLER, {
                success: true,
                list: values,
            });
        }
    });
});

ipcMain.on(DELETE_DATA, (event, id) => {
    dataList = dataList.filter((_, index) => index !== id);
    storage.set('dataList', dataList, (error) => {
        if (error) {
            console.error('Error in SEND_DATA. id: ', id);
        } else {
            mainWindow.send(DELETE_DATA_HANDLER, {
                success: true,
                list: dataList,
            });
        }
    });
});

ipcMain.on(DROP_DATABASE, (path) => {
    storage.clear(path);
    console.log('The database has been deleted');
});
