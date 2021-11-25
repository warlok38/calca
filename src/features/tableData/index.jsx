import React, { useState, useEffect } from 'react';
import { getList, deleteItem, dropDatabase } from '../addItem/rerenders';
import { Button, Popconfirm, Table } from 'antd';
import * as S from './styled';

const { ipcRenderer } = require('electron');
const {
    FETCH_DATA_HANDLER,
    DELETE_DATA_HANDLER,
} = require('../../utils/constants');

export const TableData = () => {
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
        ipcRenderer.on(DELETE_DATA_HANDLER, setListHandler);
        return () => {
            ipcRenderer.removeListener(DELETE_DATA_HANDLER, setListHandler);
        };
    });

    const columns = [
        {
            title: '№',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Название',
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
        <S.Wrapper>
            <S.Container>
                <Table
                    dataSource={list}
                    columns={columns}
                    pagination={{ position: ['bottomCenter'] }}
                />
            </S.Container>
            <S.ButtonContainer>
                <Popconfirm
                    title="Вы уверены? Это действие удалит ВСЕ данные в таблице"
                    onConfirm={confirmHandler}
                    okText="Да"
                    cancelText="Нет"
                    placement="topLeft"
                >
                    <Button type="primary">Удалить все данные</Button>
                </Popconfirm>
            </S.ButtonContainer>
        </S.Wrapper>
    );
};
