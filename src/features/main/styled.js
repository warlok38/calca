import styled from 'styled-components';
import { Form as AntdForm, Image as AntdImage } from 'antd';

export const Wrapper = styled.div`
    display: flex;
    flex: 1;
    padding: 16px;
`;

export const FormWrapper = styled.div`
    padding: 16px;
    width: 30%;
    min-width: 200px;
    background-color: #fff;
    box-shadow: 0 0 10px 5px rgba(221, 221, 221, 0.5);
    border-radius: 3px;
`;

export const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 24px;
    padding: 16px;
    min-width: 500px;
    background-color: #fff;
    box-shadow: 0 0 10px 5px rgba(221, 221, 221, 0.5);
    border-radius: 3px;
`;

export const FormItem = styled(AntdForm.Item)`
    &&& {
        margin-bottom: 16px;
        :last-child {
            margin-bottom: 0;
        }
        .ant-form-item-required::before {
            display: none;
        }
        .ant-form-item-explain {
            display: none;
        }
    }
`;

export const Image = styled(AntdImage)``;

export const Label = styled.div`
    display: flex;
    font-size: 16px;
    line-height: 19px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
`;

export const LabelSuffix = styled.div`
    margin-left: 1px;
    margin-top: auto;
    color: #797979;
    font-size: 12px;
    line-height: 14px;
`;

export const RowResult = styled(Label)`
    margin-top: 16px;
    font-size: 24px;
    line-height: 26px;
`;

export const RowResultSuffix = styled(LabelSuffix)`
    font-size: 16px;
    line-height: 19px;
`;
