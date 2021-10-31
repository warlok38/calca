import styled from 'styled-components';
import { Form as AntdForm } from 'antd';

export const Wrapper = styled.div`
    padding: 24px;
    display: flex;
`;

export const FormWrapper = styled.div``;

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
