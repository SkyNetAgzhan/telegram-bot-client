import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createAnswer } from "../http/answerApi";
import { observer } from "mobx-react-lite";

const CreateCategory = observer(({ show, onHide }) => {
    const [quest, setQuest] = useState('');
    const [language, setLanguage] = useState('русский'); 
    const [error, setError] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const addCategoryFunction = async () => {
        const parentId = language === 'русский' ? 2 : 3;
        const formData = new FormData();
        formData.append('quest', quest);
        formData.append('answertype', null);
        formData.append('parentid', parentId);
        formData.append('isnode', true);
        formData.append('answer', quest);

        try {
            await createAnswer(formData);
            setShowSuccessAlert(true);
            onHide();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить новую категорию
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
                        placeholder="Введите название категории"
                    />
                    <Form.Group className="mt-3">
                        <Form.Label>Выберите язык</Form.Label>
                        <Form.Control
                            as="select"
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <option value="русский">русский</option>
                            <option value="қазақша">қазақша</option>
                        </Form.Control>
                    </Form.Group>
                    <hr />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addCategoryFunction}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateCategory;
