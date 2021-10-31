import React from 'react';
import * as S from './styled';

export const Layout = ({ children, ...props }) => {
    return <S.Wrapper {...props}>{children}</S.Wrapper>;
};
