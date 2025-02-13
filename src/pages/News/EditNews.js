import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

const EditNews = () => {
  const [newsId, setNewsId] = useState('');
  const [newsItem, setNewsItem] = useState(null);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const fetchNewsItem = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/news/${newsId}`);
      setNewsItem(data);
      setTopic(data.topic);
      setDate(data.date.split("T")[0]);
      setText(data.text);
    } catch (err){
      console.error('Ошибка при загрузке новости: ', err);
      setMessage('Новость не найдена');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('date', date);
    formData.append('text', text);
    if(file){
      formData.append('file', file);
    }
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/news/${newsId}`, formData);
      setMessage('новость успешно обновлена!');
    } catch (err){
      console.error('Ошибка при обновлении новости:', err);
      setMessage('Ошибка при обновлении новости');
    }
  };

  return (
    <Container>
      <h2>Редактировать новость</h2>
      <Form.Group controlId="formNewsId">
        <Form.Label>ID новости</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите ID новости"
          value={newsId}
          onChange={(e) => setNewsId(e.target.value)}       
        />
        <Button variant="info" onClick={fetchNewsItem} style={{ marginTop: '10px'}}>
          Загрузить новость
        </Button>
      </Form.Group>
      {newsItem && (
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="formTopic">
            <Form.Label>Тема новости</Form.Label>
            <Form.Control
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Дата новости</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formText">
            <Form.Label>Текст новости</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formFile">
            <Form.Label>Файл (необязательно)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Обновить новость
          </Button>
        </Form>
      )}
      {message && <p>{message}</p>}

    </Container>
  );
};

export default EditNews;