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
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        if (showSuccessAlert) {
            window.alert("Новый ответ добавлен");
            setShowSuccessAlert(false);
        }
    }, [showSuccessAlert]);

    useEffect(() => {
        fetchAnswers().then(data => {
            answer.setAnswers(data);
        });
    }, [answer]);

    const addAnswerFunction = async () => {
        const formData = new FormData();
        formData.append('quest', quest);
        formData.append('answertype', 'file');
        formData.append('parentid', category); 
        formData.append('isnode', false);
        if (file) {
            formData.append('answer', file);
        } else {
            setError("Файл не выбран!");
            return;
        }

        // Log formData content
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            await createAnswer(formData);
            setShowSuccessAlert(true);
            onHide();
        } catch (err) {
            setError(err.message);
        }
    };

    const selectFile = e => {
        setFile(e.target.files[0]);
    };

    const categories = answer.answers.filter(ans => ans.isnode && ans.parentid > 1);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить новый ряд к категории
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <Form>
                    <Form.Control
                        value={quest}
                        onChange={e => setQuest(e.target.value)}
                        className="mt-3"
                        type="text"
                        placeholder="Введите название документа"
                    />
                    <Form.Group className="mt-3">
                        <Form.Label>Выберите категорию</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.quest}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
                    <hr />
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
