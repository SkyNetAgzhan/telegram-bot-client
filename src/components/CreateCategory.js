import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createAnswer } from "../http/answerApi";
import { observer } from "mobx-react-lite";

/**
 * Создать "категорию" (isnode=true),
 * привязку к #2 (русский) или #3 (казахский).
 */
const CreateCategory = observer(({ show, onHide }) => {
    const [quest, setQuest] = useState('');
    const [language, setLanguage] = useState('ru');
    const [error, setError] = useState('');

    const addCategory = async () => {
        setError('');
        const trimmedName = quest.trim();
        if (!trimmedName) {
            setError("Введите название категории!");
            return;
        }

        // Если "ru" → parentid=2, иначе parentid=3
        const parentId = (language === 'ru') ? 2 : 3;

        const formData = new FormData();
        formData.append('quest', trimmedName);
        formData.append('isnode', true);
        formData.append('answer', trimmedName);
        formData.append('answertype', '');
        formData.append('parentid', parentId);

        try {
            await createAnswer(formData);
            // При успехе закрываем модалку и сбрасываем поля
            onHide();
            setQuest('');
        } catch (err) {
            setError(err.message || "Ошибка при создании категории");
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Создать категорию</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название категории</Form.Label>
                        <Form.Control
                            value={quest}
                            onChange={e => setQuest(e.target.value)}
                            placeholder="Введите название (quest)"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Язык категории</Form.Label>
                        <Form.Select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <option value="ru">Русский</option>
                            <option value="kz">Казахский</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="primary" onClick={addCategory}>Создать</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateCategory;
