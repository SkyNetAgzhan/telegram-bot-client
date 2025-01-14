import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import CreateAnswer from '../components/CreateAnswer';
import CreateCategory from '../components/CreateCategory';

const AddAnswer = () => {
    const [createAnswerVisible, setCreateAnswerVisible] = useState(false);
    const [createCategoryVisible, setCreateCategoryVisible] = useState(false);

    return (
        <Container className='d-flex flex-column'>
            <Button
                variant='outline-dark'
                className='mt-4 p-2'
                onClick={() => setCreateCategoryVisible(true)} // Show create category modal
            >
                Добавить категорию
            </Button>
            <Button
                variant='outline-dark'
                className='mt-4 p-2'
                onClick={() => setCreateAnswerVisible(true)} // Show create answer modal
            >
                Добавить ряд к категории
            </Button>
            <CreateAnswer
                show={createAnswerVisible}
                onHide={() => setCreateAnswerVisible(false)}
            />
            <CreateCategory
                show={createCategoryVisible}
                onHide={() => setCreateCategoryVisible(false)}
            />
        </Container>
    );
};

export default AddAnswer;
