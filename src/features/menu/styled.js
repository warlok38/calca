import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #eeeeee;
`;

export const MenuItem = styled.div`
    padding: 4px 8px;
    background-color: #eeeeee;
    color: #1d1d1d;
    font-size: 14px;
    line-height: 16px;
    :hover {
        filter: brightness(0.9);
    }
    ${({ isActive }) =>
        isActive &&
        `
        background-color: #bebebe;`}
`;
