import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import * as S from './styled';

export const Menu = () => {
    const location = useLocation();

    return (
        <S.Wrapper>
            {routes.map(({ name, path }, index) => (
                <Link to={path} key={index}>
                    <S.MenuItem
                        isActive={path === location.pathname}
                        tabIndex={index}
                    >
                        {name}
                    </S.MenuItem>
                </Link>
            ))}
        </S.Wrapper>
    );
};
