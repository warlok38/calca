import React, { useState, useEffect } from 'react';
import { getList, sendItems } from './rerenders';
import { AddForm } from './AddForm';
const { ipcRenderer } = require('electron');
const {
    FETCH_DATA_HANDLER,
    SEND_DATA_HANDLER,
} = require('../../utils/constants');

export const AddItem = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        ipcRenderer.on(FETCH_DATA_HANDLER, setListHandler);
        return () => {
            ipcRenderer.removeListener(FETCH_DATA_HANDLER, setListHandler);
        };
    });
    const setListHandler = (event, data) => {
        setList([...data.list]);
    };

    useEffect(() => {
        ipcRenderer.on(SEND_DATA_HANDLER, setListHandlerWithNewItems);
        return () => {
            ipcRenderer.removeListener(
                SEND_DATA_HANDLER,
                setListHandlerWithNewItems
            );
        };
    });
    const setListHandlerWithNewItems = (event, data) => {
        setList([...list, data.list]);
    };

    const handlerSubmit = (values) => {
        sendItems(values);
    };

    return (
        <div>
            <AddForm onSubmit={handlerSubmit} />
        </div>
    );
};
