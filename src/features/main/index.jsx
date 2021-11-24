import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputNumber, Button, Radio, Image, Select } from 'antd';
import shema from '../../pictures/shema.jpg';
import * as S from './styled';
import { getList } from '../addItem/rerenders';
const { ipcRenderer } = require('electron');
const { FETCH_DATA_HANDLER } = require('../../utils/constants');

export const Main = () => {
    const u12 = 10;
    const u24 = 24;
    const rules = [{ required: true }];

    const [form] = Form.useForm();
    const [value, setValue] = useState(u12);
    const [rd, setRd] = useState(0);
    const [w, setW] = useState(0);
    const initialValues = { u: value };

    const onFinish = ({ u, i, r1, r2, rAup }) => {
        const rd = (u - 1) / i - (r2 + r1 + rAup);
        const w = Math.pow(27 / (rAup + r1 + r2 + rd), 2) * rd;
        setRd(rd);
        setW(w);
        form.resetFields();
    };
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
    }, [form]);
    ////////////
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

    const selectChangeHandler = (value) => {
        const i = list?.find((_, index) => index === value)?.i;
        const rAup = list?.find((_, index) => index === value)?.rAup;
        form.setFieldsValue({ i, rAup });
    };

    return (
        <>
            <S.Wrapper>
                <S.FormWrapper>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={initialValues}
                    >
                        <S.FormItem
                            label={<S.Label>Поиск</S.Label>}
                            name="filterByName"
                        >
                            <Select
                                placeholder="Введите название"
                                size="large"
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                onChange={selectChangeHandler}
                            >
                                {list?.map(({ name }, index) => (
                                    <Select.Option
                                        key={index}
                                        value={index}
                                        label={name}
                                    >
                                        {name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </S.FormItem>
                        <S.FormItem
                            name="u"
                            label={
                                <S.Label>
                                    U<S.LabelSuffix>ИПmin</S.LabelSuffix>
                                </S.Label>
                            }
                        >
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio value={u12}>12</Radio>
                                <Radio value={u24}>24</Radio>
                            </Radio.Group>
                        </S.FormItem>
                        <S.FormItem
                            name="i"
                            label={
                                <S.Label>
                                    I<S.LabelSuffix>сраб</S.LabelSuffix>
                                </S.Label>
                            }
                            rules={rules}
                        >
                            <InputNumber step="0.1" placeholder="0.0" />
                        </S.FormItem>
                        <S.FormItem
                            name="r1"
                            label={
                                <S.Label>
                                    R<S.LabelSuffix>1</S.LabelSuffix>
                                </S.Label>
                            }
                            rules={rules}
                        >
                            <InputNumber step="0.01" placeholder="0.00" />
                        </S.FormItem>
                        <S.FormItem
                            name="r2"
                            label={
                                <S.Label>
                                    R<S.LabelSuffix>2</S.LabelSuffix>
                                </S.Label>
                            }
                            rules={rules}
                        >
                            <InputNumber step="0.01" placeholder="0.00" />
                        </S.FormItem>
                        <S.FormItem
                            name="rAup"
                            label={
                                <S.Label>
                                    R<S.LabelSuffix>ауп</S.LabelSuffix>
                                </S.Label>
                            }
                            rules={rules}
                        >
                            <InputNumber step="0.1" placeholder="0.0" />
                        </S.FormItem>
                        <S.FormItem>
                            <Button type="primary" htmlType="submit">
                                Рассчитать
                            </Button>
                        </S.FormItem>
                        <S.FormItem>
                            <Button onClick={onReset}>Очистить</Button>
                        </S.FormItem>
                    </Form>
                </S.FormWrapper>
                <S.Container>
                    <S.Image src={shema} />
                    <S.RowResult>
                        R<S.RowResultSuffix>огр</S.RowResultSuffix>&nbsp;=&nbsp;
                        {rd}
                    </S.RowResult>
                    <S.RowResult>
                        W<S.RowResultSuffix>огр</S.RowResultSuffix>&nbsp;=&nbsp;
                        {w}
                    </S.RowResult>
                </S.Container>
            </S.Wrapper>
        </>
    );
};
