// AddAnswer.js (пример)
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import CreateCategory from '../components/CreateCategory';
import CreateSubCategory from '../components/CreateSubCategory';
import CreateSubCategoryDoc from '../components/CreateSubCategoryDoc';

const AddAnswer = () => {
    const [showCatModal, setShowCatModal] = useState(false);
    const [showSubCatModal, setShowSubCatModal] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);

    return (
        <Container className='d-flex flex-column'>
            <Button
                variant='outline-dark'
                className='mt-3'
                onClick={() => setShowCatModal(true)}
            >
                Создать категорию (RU/KZ)
            </Button>

            <Button
                variant='outline-dark'
                className='mt-3'
                onClick={() => setShowSubCatModal(true)}
            >
                Создать подкатегорию (без документа)
            </Button>

            <Button
                variant='outline-dark'
                className='mt-3'
                onClick={() => setShowDocModal(true)}
            >
                Создать подкатегорию с документом
            </Button>

            {/* Модальные окна */}
            <CreateCategory 
                show={showCatModal} 
                onHide={() => setShowCatModal(false)} 
            />
            <CreateSubCategory 
                show={showSubCatModal} 
                onHide={() => setShowSubCatModal(false)} 
            />
            <CreateSubCategoryDoc 
                show={showDocModal} 
                onHide={() => setShowDocModal(false)} 
            />
        </Container>
    );
};

export default AddAnswer;
