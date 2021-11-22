import React from 'react';
import { Router, Redirect, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { routes } from '../routes';
import { Layout } from './Layout';
import './style.css';

export const Root = () => {
    return (
        // HashRouter нужен для того, чтобы на gh-pages все грузилось
        <Router history={createBrowserHistory()}>
            <Layout>
                <Switch>
                    <Route
                        path={'/'}
                        exact
                        render={(match) => <Redirect to="/main" {...match} />}
                    />
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            component={route.component}
                            exact
                        />
                    ))}
                </Switch>
            </Layout>
        </Router>
    );
};
