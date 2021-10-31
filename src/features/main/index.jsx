import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Radio, Image } from 'antd';
import shema from '../../pictures/shema.jpg';
import * as S from './styled';

export const Main = () => {
    const u12 = 10;
    const u24 = 24;
    const rules = [{ required: true }];

    const [form] = Form.useForm();
    const [value, setValue] = useState(u12);
    const [rd, setRd] = useState(0);
    const [w, setW] = useState(0);

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

    return (
        <S.Wrapper>
            <S.FormWrapper>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ u: value }}
                >
                    <S.FormItem name="u" label="U Ип min">
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={u12}>12</Radio>
                            <Radio value={u24}>24</Radio>
                        </Radio.Group>
                    </S.FormItem>
                    <S.FormItem name="i" label="Iсраб" rules={rules}>
                        <InputNumber step="0.1" />
                    </S.FormItem>
                    <S.FormItem name="r1" label="R1" rules={rules}>
                        <InputNumber step="0.01" />
                    </S.FormItem>
                    <S.FormItem name="r2" label="R2" rules={rules}>
                        <InputNumber step="0.01" />
                    </S.FormItem>
                    <S.FormItem name="rAup" label="Rауп" rules={rules}>
                        <InputNumber step="0.1" />
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
                <Image src={shema} />
                <div>Rогр = {rd}</div>
                <div>Wогр = {w}</div>
            </S.Container>
        </S.Wrapper>
    );
};
