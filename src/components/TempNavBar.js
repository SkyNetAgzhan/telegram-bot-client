import React, { useContext } from 'react';
import { Context } from '../index';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { ANSWER_CREATE, ANSWER_ROUTE, LOGIN_ROUTE, POLLS_CREATE, POLLS_ROUTE } from '../utils/consts';
import { Button, Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const TempNavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();

    const logOut = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');

        // Reset user authentication state
        user.setIsAuth(false);
        user.setUser({});

        // Redirect to login page
        history.push(LOGIN_ROUTE);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                {user.isAuth ? (
                    <NavLink to={ANSWER_ROUTE} style={{ color: 'white', marginRight: 'auto', textDecoration: 'none' }}>
                        Main Page
                    </NavLink>
                ) : (
                    <span style={{ color: 'white', marginRight: 'auto' }}>Main Page</span>
                )}
                {user.isAuth ? (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        <NavLink to={POLLS_ROUTE} style={{ color: 'white', textDecoration: 'none'}}>
                            <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(ANSWER_CREATE)}
                            >
                                Голосования
                            </Button>
                        </NavLink>
                        <NavLink to={POLLS_CREATE} style={{ color: 'white', textDecoration: 'none'}}>
                            <Button
                                variant="outline-light"
                                style={{ marginRight: 12 }}
                                onClick={() => history.push(ANSWER_CREATE)}
                                >
                                    Создать голосования
                            </Button>
                        </NavLink>
                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(ANSWER_CREATE)}
                        >
                            Добавить
                        </Button>
                        <Button variant="outline-light" onClick={logOut}>
                            Выйти
                        </Button>
                    </Nav>
                ) : (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        <Button variant="outline-light" onClick={() => history.push(LOGIN_ROUTE)}>
                            Авторизация
                        </Button>
                    </Nav>
                )}
            </Container>
        </Navbar>
    );
});

export default TempNavBar;