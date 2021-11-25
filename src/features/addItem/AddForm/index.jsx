import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import * as S from './styled';

export const AddForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const rules = [{ required: true }];
    const onFinish = (values) => {
        onSubmit && onSubmit(values);
        form.resetFields();
    };
    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
    }, [form]);

    return (
        <>
            <S.Wrapper>
                <S.FormWrapper>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{}}
                    >
                        <S.FormItem name="name" label="Название" rules={rules}>
                            <Input placeholder="Название" />
                        </S.FormItem>
                        <S.FormItem name="i" label="Iсраб">
                            <InputNumber step="0.1" placeholder="0.0" />
                        </S.FormItem>
                        <S.FormItem name="rAup" label="Rауп">
                            <InputNumber step="0.1" placeholder="0.0" />
                        </S.FormItem>
                        <S.FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                            >
                                Добавить
                            </Button>
                        </S.FormItem>
                        <S.FormItem>
                            <Button style={{ width: '100%' }} onClick={onReset}>
                                Очистить
                            </Button>
                        </S.FormItem>
                    </Form>
                </S.FormWrapper>
            </S.Wrapper>
        </>
    );
};
