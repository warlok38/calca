import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import * as S from './styled';

export const AddForm = ({ onSubmit }) => {
    const [form] = Form.useForm();
    const [isDisabed, setDisabled] = useState(true);

    const valuesChangeHandler = () => {
        const isButtonDisabled =
            Object.values(form.getFieldsValue()).filter(
                (key) => key !== undefined && key !== ''
            ).length === 0;
        setDisabled(isButtonDisabled);
    };
    const onFinish = (values) => {
        onSubmit && onSubmit(values);
        form.resetFields();
        setDisabled(true);
    };
    const onReset = () => {
        form.resetFields();
        setDisabled(true);
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
                        onValuesChange={valuesChangeHandler}
                    >
                        <S.FormItem name="name" label="Название">
                            <Input />
                        </S.FormItem>
                        <S.FormItem name="i" label="Iсраб">
                            <InputNumber step="0.1" />
                        </S.FormItem>
                        <S.FormItem name="rAup" label="Rауп">
                            <InputNumber step="0.1" />
                        </S.FormItem>
                        <S.FormItem
                            label={
                                isDisabed && (
                                    <span style={{ color: 'darkred' }}>
                                        Заполните хотя бы 1 элемент
                                    </span>
                                )
                            }
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isDisabed}
                            >
                                Добавить
                            </Button>
                        </S.FormItem>
                        <S.FormItem>
                            <Button onClick={onReset}>Очистить</Button>
                        </S.FormItem>
                    </Form>
                </S.FormWrapper>
            </S.Wrapper>
        </>
    );
};
