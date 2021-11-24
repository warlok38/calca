const { ipcRenderer } = require('electron');
const {
    SEND_DATA,
    FETCH_DATA,
    DELETE_DATA,
    DROP_DATABASE,
} = require('../../utils/constants');

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
