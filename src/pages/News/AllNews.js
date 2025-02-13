import React, { useEffect, useState} from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";

const AllNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/news`);
      setNews(data);
    } catch(err){
      console.error('Ошибка при загрузке новостей: ', err);
    }
  }

  return (
    <Container>
      <h2>Все новости</h2>
      <Table striped bordered hover>
        <thread>
          <tr>
            <th>ID</th>
            <th>Тема</th>
            <th>Дата</th>
            <th>Текст</th>
            <th>Файл</th>
          </tr>
        </thread>
        <tbody>
          {news.map(n => {
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.topic}</td>
              <td>{new Date(n.date).toLocaleDateString()}</td>
              <td>{n.text}</td>
              <td>
                {n.file ? (
                  <a
                    href={`${process.env.REAT_APP_API_URL}/files/${n.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Смотреть файл
                  </a>
                ): 'Нет'}
              </td>
            </tr>
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllNews;