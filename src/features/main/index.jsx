import React from 'react';
import { Form, Input, Button } from 'antd';
import * as S from './styled';

export const Main = () => {
    const [form] = Form.useForm();
    const onFinish = ({ r1, r2 }) => {
        console.log(r1, r2);
        form.resetFields();
    };

    return (
        <S.Wrapper>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="r1">
                    <Input />
                </Form.Item>
                <Form.Item name="r2">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Рассчитать
                    </Button>
                </Form.Item>
            </Form>
        </S.Wrapper>
    );
};
