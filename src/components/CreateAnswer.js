import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createAnswer, fetchAnswers } from "../http/answerApi";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const CreateAnswer = observer(({ show, onHide }) => {
    const { answer } = useContext(Context);

    const [quest, setQuest] = useState('');
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState(''); 
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            // При каждом открытии модалки обновим список
            fetchAnswers().then(data => {
                answer.setAnswers(data);
            }).catch(err => {
                console.error('Error fetching answers:', err);
            });
        }
    }, [answer, show]);

    const addAnswerFunction = async () => {
        setError('');
        const trimmedName = quest.trim();

        if (!trimmedName) {
            setError("Введите название (quest)!");
            return;
        }
        if (!category) {
            setError("Выберите категорию (родителя)!");
            return;
        }
        if (!file) {
            setError("Файл не выбран!");
            return;
        }

        // Формируем данные для запроса
        const formData = new FormData();
        formData.append('quest', trimmedName);
        formData.append('answertype', 'file');
        formData.append('parentid', category);
        formData.append('isnode', false);
        formData.append('answer', file);

        try {
            await createAnswer(formData);
            onHide();
            setQuest('');
            setFile(null);
            setCategory('');
        } catch (err) {
            setError(err.message || "Ошибка при добавлении файла");
        }
    };

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    // Фильтруем записи: должны быть (isnode=true), id != 1,2,3
    const filteredCategories = Array.isArray(answer.answers?.rows)
        ? answer.answers.rows.filter(
            (ans) => ans.isnode === true && ![1,2,3].includes(ans.id)
          )
        : [];

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить документ (подкатегорию)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название документа (quest)</Form.Label>
                        <Form.Control
                            value={quest}
                            onChange={e => setQuest(e.target.value)}
                            type="text"
                            placeholder="Введите название документа"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Выберите родительскую категорию</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">-- выбрать --</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {`#${cat.id} — ${cat.quest}`}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Загрузить файл</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={selectFile}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addAnswerFunction}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateAnswer;
