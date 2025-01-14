import React, { useContext, useEffect, useState } from 'react';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchAnswers, deleteAnswer, swapCategoriesAndSubs, swapSubs} from '../http/answerApi';
import AnswerTree from '../components/AnswerTree';
import '../App.css'; // Ensure you have the App.css imported for the styles

const Answer = observer(() => {
    const { answer } = useContext(Context);
    // Список «категорий» (isnode=true, parentid>1)
    const [categories, setCategories] = useState([]);

    // Для модального окна свапа
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // какую категорию хотим «свапнуть»
    const [targetCategoryId, setTargetCategoryId] = useState('');       // с какой категорией «свапать»

    // Для модального окна свапа подкатегорий
    const [showSwapModalSub, setShowSwapModalSub] = useState(false);
    const [selectedSubid, setSelectedSubid] = useState(null);
    const [targetSubId, setTargetSubId] = useState('');

    useEffect(() => {
        fetchAnswers().then(data => {
            answer.setAnswers(data);
            data.rows.sort((a,b) => a.id  - b.id);
            // Фильтруем только категории (isnode = true) и parentid > 1
            const filteredCategories = data.rows.filter(ans => ans.isnode === true && ans.parentid > 1);
            setCategories(filteredCategories);
        });
    }, [answer]);

    // Получаем все «строки» (isnode=false) у заданной категории
    const getCategoryRows = (categoryId) => {
        return answer.answers
            .filter(ans => ans.parentid === categoryId && ans.isnode === false)
            .sort((a,b) => a.id - b.id);
    };

    // Удаление категории (исходный код)
    const handleDeleteCategory = async (categoryId) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту категорию и все связанные с ней ряды?');
        if (!isConfirmed) return;

        try {
            // Сначала удаляем все дочерние «строки»
            const rowsToDelete = getCategoryRows(categoryId);
            for (const row of rowsToDelete) {
                await deleteAnswer(row.id);
            }
            // Удаляем категорию
            await deleteAnswer(categoryId);

            // Обновляем локальный стейт
            const updatedAnswers = answer.answers.filter(a => a.id !== categoryId && a.parentid !== categoryId);
            answer.setAnswers({ rows: updatedAnswers });
        } catch (error) {
            alert('Ошибка при удалении категории');
        }
    };

    // Удаление конкретной «строки»
    const handleDeleteRow = async (rowId) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот ряд?');
        if (!isConfirmed) return;

        try {
            await deleteAnswer(rowId);
            const updatedAnswers = answer.answers.filter(a => a.id !== rowId);
            answer.setAnswers({ rows: updatedAnswers });
        } catch (error) {
            alert('Ошибка при удалении ряда');
        }
    };

    // === ЛОГИКА ДЛЯ СВАПА ===

    // Клик по кнопке «Поменять местами» у конкретной категории
    const handleOpenSwapModal = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setTargetCategoryId(''); // сбрасываем выбор
        setShowSwapModal(true);
    };

    // Подтверждаем свап
    const handleConfirmSwap = async () => {
        if (!targetCategoryId) {
            alert('Пожалуйста, выберите категорию для обмена');
            return;
        }

        if (selectedCategoryId === Number(targetCategoryId)) {
            alert('Нельзя выбирать ту же категорию.');
            return;
        }

        // Вызываем метод из API
        if (!window.confirm(`Точно поменять местами категории #${selectedCategoryId} и #${targetCategoryId}?`)) {
            return;
        }

        try {
            await swapCategoriesAndSubs(selectedCategoryId, Number(targetCategoryId));
            alert(`Категории #${selectedCategoryId} и #${targetCategoryId} успешно поменяны местами!`);
            // Перезагружаем список
            const data = await fetchAnswers();
            answer.setAnswers(data);
            const filtered = data.rows.filter(ans => ans.isnode === true && ans.parentid > 1);
            setCategories(filtered);
        } catch (error) {
            alert('Ошибка при обмене категорий: ' + error.message);
        } finally {
            setShowSwapModal(false);
        }
    };

    // Закрыть модальное окно
    const handleCloseSwapModal = () => {
        setShowSwapModal(false);
    };

    
    // --- Свап подкатегории ---
    const handleOpenSwapSubModal = (sub) => {
        setSelectedSubid(sub);
        setTargetSubId('');
        setShowSwapModalSub(true);
    }

    const handleConfirmSwapSub = async () => {
        if (!targetSubId){
            alert('Выберите подкатегорию для обмена');
            return;
        }
        if (selectedSubid === Number(targetSubId)) {
            alert('Нельзя выбрать ту же самую подкатегорию!');
            return;
        }
        if (!window.confirm(`Поменять местами подкатегории #${selectedSubid.id} и #${targetSubId}?`)){
            return;
        }

        try {
            await swapSubs(selectedSubid.id, Number(targetSubId));
            alert(`Подкатегории #${selectedSubid.id} и #${targetSubId} успешно поменяны местами!`);
            const data = await fetchAnswers();
            answer.setAnswers(data);
        } catch (error) {
            alert('Ошибка при свапе подкатегорий:' + error.message);
        } finally {
            handleCloseSwapModalSub();
        }
    }

    const handleCloseSwapModalSub = () => {
        setShowSwapModalSub(false);
        setSelectedSubid(null);
    };

    const getSiblingsForSelectedSub = () => {
        if (!selectedSubid) return [];
        return answer.answers
            .filter(a => 
                a.isnode === false &&
                a.parentid === selectedSubid.parentid &&
                a.id !== selectedSubid.id
            )
            .sort((a,b) => a.id - b.id);
    };

    return (
        <Container>
            <AnswerTree />

            <h2>Категории ответов</h2>
            {categories.length > 0 ? (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th className="center-align">ID</th>
                            <th>Название категории</th>
                            <th className="center-align">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="center-align">{category.id}</td>
                                <td>{category.quest}</td>
                                <td className="center-align">
                                    <button onClick={() => handleDeleteCategory(category.id)}>Удалить</button>
                                    {' '}
                                    <button onClick={() => handleOpenSwapModal(category.id)}>
                                        Поменять местами
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет доступных категорий</p>
            )}

            {categories.length > 0 ? (
                categories.map(category => (
                    <div key={category.id}>
                        <h2>{category.quest}</h2>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th className="center-align">ID</th>
                                    <th>Название темы</th>
                                    <th>Название файла</th>
                                    <th className="center-align">Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCategoryRows(category.id).map(row => (
                                    <tr key={row.id}>
                                        <td className="center-align">{row.id}</td>
                                        <td>{row.quest}</td>
                                        <td>{row.answer}</td>
                                        <td className="center-align">
                                            <button onClick={() => handleDeleteRow(row.id)}>Удалить</button>
                                            {' '}
                                            <button onClick={() => handleOpenSwapSubModal(row)}>
                                                Поменять местами
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br/>
                    </div>
                ))
            ) : (
                <p>No categories available</p>
            )}

            {/* Модальное окно для свапа */}
            <Modal show={showSwapModal} onHide={handleCloseSwapModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Выберите категорию для обмена</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Текущая категория: #{selectedCategoryId}</Form.Label>
                    <Form.Select
                        value={targetCategoryId}
                        onChange={(e) => setTargetCategoryId(e.target.value)}
                    >
                        <option value="">-- Выберите категорию --</option>
                        {categories
                            .filter(cat => cat.id !== selectedCategoryId) // исключаем текущую
                            .map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    #{cat.id} — {cat.quest}
                                </option>
                            ))
                        }
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSwapModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleConfirmSwap}>
                        Поменять местами
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно для свапа подкатегорий */}
            <Modal show={showSwapModalSub} onHide={handleCloseSwapModalSub}>
                <Modal.Header closeButton>
                    <Modal.Title>Свап подкатегории</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSubid && (
                        <>
                            <Form.Label>
                                Текущая подкатегория: #{selectedSubid.id} ({selectedSubid.quest})
                            </Form.Label>
                            <Form.Select
                                value={targetSubId}
                                onChange={(e) => setTargetSubId(e.target.value)}
                            >
                                <option value="">
                                    --- Выберите подкатегорию ---
                                </option>
                                {getSiblingsForSelectedSub().map(sib => (
                                    <option key={sib.id} value={sib.id}>
                                        #{sib.id} - {sib.quest}
                                    </option>
                                ))}
                            </Form.Select>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSwapModalSub}>
                            Отмена
                        </Button>
                        <Button variant="primary" onClick={handleConfirmSwapSub}>
                            Поменять местами
                        </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default Answer;
