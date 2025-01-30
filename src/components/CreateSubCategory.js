import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createAnswer, fetchAnswers } from "../http/answerApi";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

/**
 * Создать подкатегорию (isnode=true), без документа.
 * Выбираем parent из списка категорий (isnode=true).
 */
const CreateSubCategory = observer(({ show, onHide }) => {
    const { answer } = useContext(Context);  // доступ к AnswerStore

    const [quest, setQuest] = useState('');
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            // при открытии модалки - грузим список из БД
            fetchAnswers()
                .then(data => {
                    // data = {rows: [...], count: ...}
                    answer.setAnswers(data); // теперь answer.answers = data.rows
                })
                .catch(err => console.error('Error fetching answers:', err));
        }
    }, [show, answer]);

    const addSubCategory = async () => {
        setError('');
        const trimmedName = quest.trim();
        if (!trimmedName) {
            setError("Введите название подкатегории!");
            return;
        }
        if (!parentId) {
            setError("Выберите родителя!");
            return;
        }

        const formData = new FormData();
        formData.append('quest', trimmedName);
        formData.append('isnode', true);        // т.к. это «подкатегория»
        formData.append('answer', trimmedName); // можно так же дублировать
        formData.append('answertype', '');
        formData.append('parentid', parentId);

        try {
            await createAnswer(formData);
            onHide();
            setQuest('');
            setParentId('');
        } catch (err) {
            setError(err.message || "Ошибка при создании подкатегории");
        }
    };

    // Теперь answer.answers – это МАССИВ
    // Фильтруем только те, у которых isnode=true, и при желании исключаем #1,2,3
    const categories = answer.answers.filter(a => {
        return a.isnode === true && ![1,2,3].includes(a.id);
    });

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Создать подкатегорию (без документа)</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            value={quest}
                            onChange={e => setQuest(e.target.value)}
                            placeholder="Введите название подкатегории"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Родительская категория</Form.Label>
                        <Form.Select
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">-- выбрать --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {`#${cat.id} — ${cat.quest}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="primary" onClick={addSubCategory}>Создать</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateSubCategory;
