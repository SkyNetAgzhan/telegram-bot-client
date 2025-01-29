import React, { useState } from 'react';
import { createPoll } from '../http/PollApi';
import { Form, Button, Container } from 'react-bootstrap';

const CreatePoll = () => {
  // Храним вопрос на русском и казахском
  const [questionRu, setQuestionRu] = useState('');
  const [questionKz, setQuestionKz] = useState('');

  // Опции: массив объектов [{ru:'', kz:''}, ...]
  const [options, setOptions] = useState([
    { ru: '', kz: '' },
    { ru: '', kz: '' }
  ]);

  // Изменение текста в опции
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  // Добавить ещё одну опцию
  const handleAddOption = () => {
    setOptions([...options, { ru: '', kz: '' }]);
  };

  // Удалить опцию
  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Формируем данные под новый сервер
      const payload = {
        questionRu,
        questionKz,
        options // [{ru:..., kz:...}, {...}, ...]
      };
      await createPoll(payload);
      alert('Голосование успешно создано!');
      // Можно сбросить поля формы
      setQuestionRu('');
      setQuestionKz('');
      setOptions([{ ru: '', kz: '' }, { ru: '', kz: '' }]);
    } catch (error) {
      alert('Ошибка при создании голосования');
    }
  };

  return (
    <Container>
      <h1>Создать голосование</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Вопрос на русском</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите вопрос (RU)"
            value={questionRu}
            onChange={(e) => setQuestionRu(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Вопрос на казахском</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите вопрос (KZ)"
            value={questionKz}
            onChange={(e) => setQuestionKz(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Label>Варианты ответа</Form.Label>
        {options.map((option, index) => (
          <div key={index} className="mb-3 border p-2 rounded">
            <Form.Group className="mb-2">
              <Form.Label>Вариант (RU)</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Вариант ${index + 1} (RU)`}
                value={option.ru}
                onChange={(e) => handleOptionChange(index, 'ru', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Вариант (KZ)</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Вариант ${index + 1} (KZ)`}
                value={option.kz}
                onChange={(e) => handleOptionChange(index, 'kz', e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="danger"
              onClick={() => handleRemoveOption(index)}
            >
              Удалить вариант
            </Button>
          </div>
        ))}

        <Button variant="secondary" onClick={handleAddOption}>
          Добавить вариант
        </Button>

        <div className="mt-3" style={{ marginBottom: '20px'}}>
          <Button variant="primary" type="submit">
            Создать
          </Button>
        </div>

      </Form>
    </Container>
  );
};

export default CreatePoll;
