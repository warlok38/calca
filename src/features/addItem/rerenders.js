const { ipcRenderer } = require('electron');
const {
    FETCH_DATA_FROM_STORAGE,
    SAVE_DATA_IN_STORAGE,
    REMOVE_DATA_FROM_STORAGE,
    SEND_DATA,
    FETCH_DATA,
    DELETE_DATA,
    DROP_DATABASE,
} = require('../../utils/constants');

// This renderer file contains much of our front end code for communicating with main. For that reason, it's similar to making api calls to the server, except here the calls are not asynchronous.

// There are also similar handler functions on the React side

// -----------------------------------------------------------------
// Functions for calling main

// Ask main to load data from its persistent storage
export function loadSavedData() {
    ipcRenderer.send(FETCH_DATA_FROM_STORAGE, 'itemsToTrack');
}

// Send item message to main
export function saveDataInStorage(item) {
    ipcRenderer.send(SAVE_DATA_IN_STORAGE, item);
}

// Remove an item
export function removeDataFromStorage(item) {
    ipcRenderer.send(REMOVE_DATA_FROM_STORAGE, item);
}

////////NEW//////NEW////////////NEW/////////

export const getList = () => {
    ipcRenderer.send(FETCH_DATA, 'dataList');
};

export const sendItems = (values) => {
    ipcRenderer.send(SEND_DATA, values);
};

export const deleteItem = (id) => {
    ipcRenderer.send(DELETE_DATA, id);
};

export const dropDatabase = () => {
    ipcRenderer.send(DROP_DATABASE, 'dataList');
};
