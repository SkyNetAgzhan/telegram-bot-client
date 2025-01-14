import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, onHide, onConfirm }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить этот документ?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Отмена</Button>
            <Button variant="danger" onClick={onConfirm}>Удалить</Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmDeleteModal;
