import React, { useState, useEffect } from 'react';
import { getList, sendItems, deleteItem, dropDatabase } from './rerenders';
import { Button, Popconfirm, Table } from 'antd';
import { Link } from 'react-router-dom';
import { AddForm } from './AddForm';
const { ipcRenderer } = require('electron');
const {
    FETCH_DATA_HANDLER,
    SEND_DATA_HANDLER,
    DELETE_DATA_HANDLER,
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
        console.log(data);
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
