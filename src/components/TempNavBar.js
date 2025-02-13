// src/components/TempNavBar.js

import React, { useContext } from 'react';
import { Context } from '../index';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
// Импорт ваших констант
import { 
  ANALYTICS_ROUTE, 
  ANSWER_CREATE, 
  ANSWER_ROUTE, 
  LOGIN_ROUTE, 
  POLLS_CREATE, 
  POLLS_ROUTE 
} from '../utils/consts';

const TempNavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();

    const logOut = () => {
        localStorage.removeItem('token');
        user.setIsAuth(false);
        user.setUser({});
        history.push(LOGIN_ROUTE);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                
                {user.isAuth ? (
                    // Если пользователь авторизован
                    <div style={{ marginRight: 'auto' }}>
                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(ANSWER_ROUTE)}
                        >
                            Main page
                        </Button>
                    </div>
                ) : (
                    // Если не авторизован
                    <span style={{ color: 'white', marginRight: 'auto' }}>Main Page</span>
                )}

                {user.isAuth ? (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        
                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(POLLS_ROUTE)}
                        >
                            Голосования
                        </Button>

                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(POLLS_CREATE)}
                        >
                            Создать голосования
                        </Button>

                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(ANALYTICS_ROUTE)}
                        >
                            Аналитика
                        </Button>
                        
                        <Button
                            variant="outline-light"
                            style={{ marginRight: 12 }}
                            onClick={() => history.push(ANSWER_CREATE)}
                        >
                            Добавить
                        </Button>

                        <Button 
                            variant="outline-light" 
                            onClick={logOut}
                        >
                            Выйти
                        </Button>
                    </Nav>
                ) : (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        <Button 
                            variant="outline-light" 
                            onClick={() => history.push(LOGIN_ROUTE)}
                        >
                            Авторизация
                        </Button>
                    </Nav>
                )}
            </Container>
        </Navbar>
    );
});

export default TempNavBar;
