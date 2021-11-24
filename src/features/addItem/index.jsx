import React, { useState, useEffect } from 'react';
import {
    loadSavedData,
    saveDataInStorage,
    getList,
    sendItems,
    deleteItem,
    dropDatabase,
} from './rerenders';
import List from './List';
import { Button, Popconfirm, Table } from 'antd';
import { Link } from 'react-router-dom';
import { AddForm } from './AddForm';
const { ipcRenderer } = require('electron');
const {
    HANDLE_FETCH_DATA,
    HANDLE_SAVE_DATA,
    HANDLE_REMOVE_DATA,
    FETCH_DATA_HANDLER,
    SEND_DATA_HANDLER,
    DELETE_DATA_HANDLER,
} = require('../../utils/constants');

export const AddItem = () => {
    const [val, setVal] = useState('');
    const [itemsToTrack, setItems] = useState([]);

    // Grab the user's saved itemsToTrack after the app loads
    useEffect(() => {
        loadSavedData();
    }, []);

    // Listener functions that receive messages from main
    useEffect(() => {
        ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem);
        // If we omit the next step, we will cause a memory leak and & exceed max listeners
        return () => {
            ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewItem);
        };
    });
    useEffect(() => {
        ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData);
        return () => {
            ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData);
        };
    });
    useEffect(() => {
        ipcRenderer.on(HANDLE_REMOVE_DATA, handleReceiveData);
        return () => {
            ipcRenderer.removeListener(HANDLE_REMOVE_DATA, handleReceiveData);
        };
    });

    // Receives itemsToTrack from main and sets the state
    const handleReceiveData = (event, data) => {
        setItems([...data.message]);
    };

    // Receives a new item back from main
    const handleNewItem = (event, data) => {
        setItems([...itemsToTrack, data.message]);
    };

    // Manage state and input field
    const handleChange = (e) => {
        setVal(e.target.value);
    };

    // Send the input to main
    const addItem = (input) => {
        saveDataInStorage(input);
        setVal('');
    };

    /////NEW//////////////NEW//////////////NEW/////////////////NEW//////////////
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
        console.log(data);
        setList([...data.list]);
    };

    useEffect(() => {
        ipcRenderer.on(SEND_DATA_HANDLER, setListHandlerWithNewItems);
        // If we omit the next step, we will cause a memory leak and & exceed max listeners
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

    useEffect(() => {
        ipcRenderer.on(DELETE_DATA_HANDLER, setListHandler);
        return () => {
            ipcRenderer.removeListener(DELETE_DATA_HANDLER, setListHandler);
        };
    });

    const handlerSubmit = (values) => {
        sendItems(values);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Iсраб',
            dataIndex: 'i',
        },
        {
            title: 'Rауп',
            dataIndex: 'rAup',
        },
        {
            title: 'Действия',
            render: (text, record, index) => (
                <Button onClick={() => deleteItem(index)}>удалить</Button>
            ),
        },
    ];

    const confirmHandler = async () => {
        await dropDatabase();
        getList();
    };

    return (
        <div>
            <Link to="/main">
                <Button>На главную</Button>
            </Link>
            <div style={{ display: 'flex' }}>
                <Button type="primary" onClick={() => addItem(val)}>
                    New Item
                </Button>
                <input type="text" onChange={handleChange} value={val} />
            </div>
            {itemsToTrack.length ? (
                <List itemsToTrack={itemsToTrack} />
            ) : (
                <p>Add an item to get started</p>
            )}
            <AddForm onSubmit={handlerSubmit} />
            <Table dataSource={list} columns={columns} />
            <Popconfirm
                title="Вы уверены, что хотите удалить все данные?"
                onConfirm={confirmHandler}
                okText="Да"
                cancelText="Нет"
            >
                <Button type="primary">Удалить все данные</Button>
            </Popconfirm>
        </div>
    );
};
