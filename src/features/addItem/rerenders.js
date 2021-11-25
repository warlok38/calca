import { message } from 'antd';

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
    message.success(`Запись "${values.name}" добавлена`);
};

export const deleteItem = (id) => {
    ipcRenderer.send(DELETE_DATA, id);
    message.success(`Запись № ${id + 1} удалена`);
};

export const dropDatabase = () => {
    ipcRenderer.send(DROP_DATABASE, 'dataList');
    message.success(`База данных удалена`);
};
