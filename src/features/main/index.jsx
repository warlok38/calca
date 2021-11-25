import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Radio, Select, message } from 'antd';
import shema from '../../pictures/shema.jpg';
import * as S from './styled';
import { getList } from '../addItem/rerenders';
const { ipcRenderer } = require('electron');
const { FETCH_DATA_HANDLER } = require('../../utils/constants');

export const Main = () => {
    const u12 = 10;
    const u24 = 24;
    const rowE24 = [
        0, 1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9,
        4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10, 11, 12, 13, 15, 16, 18,
        20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91, 100,
        110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390,
        430, 470, 510, 560, 620, 680, 750, 820, 910,
    ];

    const roundByRowE24 = (value) => {
        let roundedValue;
        for (let i = 0; i < rowE24.length; i++) {
            if (value > rowE24[i]) {
            } else if (value === rowE24[i]) {
                roundedValue = rowE24[i];
                break;
            } else if (value < rowE24[i]) {
                roundedValue = rowE24[i - 1];
                break;
            }
        }
        return roundedValue;
    };

    const [form] = Form.useForm();
    const [value, setValue] = useState(u12);
    const [rd, setRd] = useState(0);
    const [w, setW] = useState(0);
    const initialValues = { u: value };
    const rules = [{ required: true }];

    const onFinish = ({ u, i, r1, r2, rAup }) => {
        const rd = (u - 1) / i - (r2 + r1 + rAup);
        const roundedRd =
            rd < 1000 ? roundByRowE24(rd) : roundByRowE24(rd / 1000) * 1000;
        const w = Math.pow(27 / (rAup + r1 + r2 + roundedRd), 2) * roundedRd;
        if (typeof roundedRd === 'number') {
            setRd(roundedRd);
            setW(w);
        } else {
            message.error('Расчет невозможен');
        }
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
                        <S.RowResultNumber title={rd}>{rd}</S.RowResultNumber>
                    </S.RowResult>
                    <S.RowResult>
                        W<S.RowResultSuffix>огр</S.RowResultSuffix>&nbsp;=&nbsp;
                        <S.RowResultNumber title={w}>{w}</S.RowResultNumber>
                    </S.RowResult>
                </S.Container>
            </S.Wrapper>
        </>
    );
};
