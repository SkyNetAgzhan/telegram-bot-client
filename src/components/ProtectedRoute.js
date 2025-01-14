import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../index';
import { LOGIN_ROUTE } from '../utils/consts';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = useContext(Context);

    return (
        <Route
            {...rest}
            render={(props) =>
                user.isAuth ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={LOGIN_ROUTE} />
                )
            }
        />
    );
};

export default ProtectedRoute;
