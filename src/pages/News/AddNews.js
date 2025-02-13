import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

const AddNews = () => {
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('date', date);
    formData.append('text', text);
    if(file){
      formData.append('file', file);
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/news`, formData);
      setMessage('Новость успешно добавлена!');
      setTopic('');
      setDate('');
      setText('');
      setFile(null);
    } catch (err){
      console.error('Ошибка при добавлении новости: ', err);
      setMessage('Ошибка при добавлении новости');
    }
  };

  return (
    <Container>
      <h2>Добавить новости</h2>
      {message && <p>{message}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTopic">
          <Form.Label>Тема новости</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите тему"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formText">
          <Form.Label>Текст новости</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Введите текст новости"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFile">
          <Form.Label>Файл (неоьязательно)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Добавить новость
        </Button>
      </Form>
    </Container>
  )
}

export default AddNews;