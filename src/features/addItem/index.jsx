import React, { useState, useEffect } from 'react';
import { loadSavedData, saveDataInStorage } from './rerenders';
import List from './List';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
const { ipcRenderer } = require('electron');
const {
    HANDLE_FETCH_DATA,
    HANDLE_SAVE_DATA,
    HANDLE_REMOVE_DATA,
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
        </div>
    );
};
