import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import ProtectedRoute from './ProtectedRoute';
import { ANSWER_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import { Context } from '../index';

const AppRouter = ({ handleDelete }) => {
    const { user } = useContext(Context);

    return (
        <Switch>
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} component={Component} exact />
            ))}

            {authRoutes.map(({ path, Component }) => (
                <ProtectedRoute key={path} path={path} component={props => <Component {...props} handleDelete={handleDelete} />} exact />
            ))}

            <Redirect to={user.isAuth ? ANSWER_ROUTE : LOGIN_ROUTE} />
        </Switch>
    );
};

export default AppRouter;
