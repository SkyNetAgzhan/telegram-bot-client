import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../';
import '../App.css';

const AnswerBar = observer(({ handleDelete }) => {
    const { answer } = useContext(Context);

    const allAnswers1 = Array.isArray(answer.answers) ? answer.answers.filter(a => a.parentid === 3) : [];
    const allAnswers2 = Array.isArray(answer.answers) ? answer.answers.filter(a => a.parentid > 3) : [];

    return (
        <div>
            <h1 style={{ marginStart: 220 }}>База данных телеграм бота</h1>
            <h2 style={{ marginStart: 190 }}>Таблица ответов: информация о санаториях</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Название темы</th>
                        <th scope="col">Название файла</th>
                        <th scope="col">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {allAnswers1.map(({ id, quest, answer }) => (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{quest}</td>
                            <td>{answer}</td>
                            <td>
                                <button onClick={() => handleDelete(id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ marginStart: 190 }}>Таблица ответов: квоты на санатори</h2>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Название темы</th>
                        <th scope="col">Название файла</th>
                        <th scope="col">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {allAnswers2.map(({ id, quest, answer }) => (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{quest}</td>
                            <td>{answer}</td>
                            <td>
                                <button onClick={() => handleDelete(id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
        </div>
    );
});

export default AnswerBar;
