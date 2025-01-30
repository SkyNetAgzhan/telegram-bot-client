import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createAnswer, fetchAnswers } from "../http/answerApi";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

/**
 * Создать "подкатегорию" (isnode=false) c документом.
 * Выбираем родителя (isnode=true).
 */
const CreateSubCategoryDoc = observer(({ show, onHide }) => {
    const { answer } = useContext(Context);

    const [quest, setQuest] = useState('');
    const [parentId, setParentId] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            fetchAnswers()
                .then(data => {
                    answer.setAnswers(data);
                })
                .catch(err => console.error('Error fetching answers:', err));
        }
    }, [show, answer]);

    const addSubCategoryWithDoc = async () => {
        setError('');
        const trimmedName = quest.trim();
        if (!trimmedName) {
            setError("Введите название!");
            return;
        }
        if (!parentId) {
            setError("Выберите родительскую категорию!");
            return;
        }
        if (!file) {
            setError("Файл не выбран!");
            return;
        }

        const formData = new FormData();
        formData.append('quest', trimmedName);
        formData.append('isnode', false);       // файл => isnode=false
        formData.append('answertype', 'file');
        formData.append('parentid', parentId);
        formData.append('answer', file);

        try {
            await createAnswer(formData);
            onHide();
            // Сбросить поля
            setQuest('');
            setParentId('');
            setFile(null);
        } catch (err) {
            setError(err.message || "Ошибка при добавлении файла");
        }
    };

    // Массив записей
    const categories = answer.answers.filter(a => {
        return a.isnode === true && ![1,2,3].includes(a.id);
    });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Создать подкатегорию с документом</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            value={quest}
                            onChange={e => setQuest(e.target.value)}
                            placeholder="Введите название документа"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Родитель</Form.Label>
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

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите файл</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Отмена</Button>
                <Button variant="primary" onClick={addSubCategoryWithDoc}>Создать</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateSubCategoryDoc;
