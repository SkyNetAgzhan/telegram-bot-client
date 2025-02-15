import React, { useContext, useState } from 'react';
import { useLocation, NavLink, useHistory } from 'react-router-dom';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';
import { ANSWER_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { login, registration } from '../http/userApi';
import { Context } from '../index'; 
import { observer } from 'mobx-react-lite';

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const click = async () => {
        try {
            let answerData;
            if (isLogin) {
                answerData = await login(email, password);
            } else {
                answerData = await registration(email, password);
            }
            user.setUser(user);
            user.setIsAuth(true);
            history.push(ANSWER_ROUTE);
        } catch (e) {
            setError(e.response?.data?.message || 'An unexpected error occurred'); // Set error state
        }
    };

    return (
        <Container 
            className='d-flex justify-content-center align-items-center'
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className='p-5'>
                <h2 className='m-auto'>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} {/* Display errors */}
                <Form className='d-flex flex-column'>
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите ваш email...'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className='mt-3'
                        placeholder='Введите ваш пароль...'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type='password'
                    />
                    <Row className="d-flex justify-content-between mt-3 ps-3 pe-3">
                        {/* isLogin ?
                            <div style={{ marginBottom: 10 }}>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div style={{ marginBottom: 10 }}>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        */}
                        <Button
                            style={{ marginStart: 0 }}
                            variant='outline-success'
                            onClick={click}
                        >
                            {isLogin ? "Войти" : "Регистрация"}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
