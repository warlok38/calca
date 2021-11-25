import styled from 'styled-components';
import { Form as AntdForm } from 'antd';

export const Wrapper = styled.div`
    padding: 16px;
    display: flex;
`;

export const FormWrapper = styled.div`
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 0 10px 5px rgba(221, 221, 221, 0.5);
    border-radius: 3px;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 24px;
`;

export const FormItem = styled(AntdForm.Item)`
    &&& {
        margin-bottom: 16px;
        .ant-form-item-required::before {
            display: none;
        }
        .ant-form-item-explain {
            display: none;
        }
    }
`;
