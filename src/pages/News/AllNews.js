import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { fetchNews , deleteNews} from "../../http/newsApi";

const AllNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await fetchNews();
      setNews(data);
    }catch(err){
      console.error("Ошибка при загрузке новостей: ", err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Вы действительно хотите удалить эту новость?")){
      try {
        await deleteNews(id);
        loadNews();
      }catch (err){
        console.error("Ошибка при удалении новости:", err);
      }
    }
  };

  return (
    <Container>
      <h2>Все новости</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тема</th>
            <th>Дата</th>
            <th>Текст</th>
            <th>Файл</th>
          </tr>
        </thead>
        <tbody>
          {news.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.topic}</td>
              <td>{new Date(n.date).toLocaleDateString()}</td>
              <td>{n.text}</td>
              <td>
                {n.file ? (
                  n.file
                ) : (
                  "Нет"
                )}
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(n.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllNews;