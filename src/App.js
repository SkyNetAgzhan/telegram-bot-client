import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/TempNavBar';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import { check } from './http/userApi';
import { Spinner } from 'react-bootstrap';
import ErrorBoundary from './components/ErrorBoundary';
import { deleteAnswer } from './http/answerApi';

const App = observer(() => {
    const { user, answer } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check()
            .then(data => {
                if (data) {
                    user.setUser(data);
                    user.setIsAuth(true);
                } else {
                    user.setIsAuth(false);
                }
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return <Spinner animation={'grow'} />;
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот документ?');
        if (!isConfirmed) {
            return;
        }

        try {
            await deleteAnswer(id);
            const updatedAnswers = answer.answers.filter(a => a.id !== id);
            answer.setAnswers({ rows: updatedAnswers });
        } catch (error) {
            alert('Ошибка при удалении документа');
        }
    };

    return (
        <BrowserRouter>
            <ErrorBoundary>
                <NavBar />
                <AppRouter handleDelete={handleDelete} />
            </ErrorBoundary>
        </BrowserRouter>
    );
});

export default App;
