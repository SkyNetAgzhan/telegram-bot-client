import React, { useEffect, useState } from 'react';
import { fetchPolls, votePoll, deletePoll } from '../http/PollApi';
import { Card, Button, Container } from 'react-bootstrap';

const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const loadPolls = async () => {
      try {
        const data = await fetchPolls();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    loadPolls();
  }, []);

  const handleVote = async (pollId, optionId) => {
    try {
      await votePoll(pollId, optionId);
      alert('Ваш голос засчитан!');
    } catch (error) {
      alert('Ошибка при голосовании');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Вы уверены, что хотите удалить это голосование?')){
      try {
        await deletePoll(pollId);
        setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
        alert('Голосование успешно удалено!');
      }catch ( error ){
        alert('Ошибка при удалении голосования.');
      }
    }
  };

  return (
    <Container>
      <h1>Список голосований</h1>
      {polls.map((poll) => (
        <Card key={poll.id} className="mb-3">
          <Card.Body>
            <Card.Title>
              <p>Вопрос на русском: {poll.questionRu}</p>
              <p>Вопрос на казахском: {poll.questionKz}</p>
            </Card.Title>

            <div className="d-flex justify-content-between">
              <div>
                <h6>Ответы на русском и количесво голосов</h6>
                {poll.poll_options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline-primary"
                    className="d-block mb-2"
                    onClick={() => handleVote(poll.id, option.id)}
                  >
                    {option.optionTextRu}
                  </Button>
                ))}
              </div>
              <div style={{marginRight: '220px'}}>
                <h6>Ответы на казахском и количесво голосов</h6>
                {poll.poll_options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline-primary"
                    className="d-block mb-2"
                    onClick={() => handleVote(poll.id, option.id)}
                  >
                    {option.optionTextKz}
                  </Button>
                ))}
             </div>
            </div>
            {/* Количество голосов */}
            <div className="d-flex">
              <div className="left-column">
                {poll.poll_options.map((option) => (
                  <div key={option.id}>
                    <strong>{option.optionTextRu}</strong>
                    <p>{option.poll_votes?.length || 0} голосов</p>
                  </div>
                ))}
              </div>
              <div className="right-column" style={{marginLeft: '300px'}}>
                {poll.poll_options.map((option) => (
                  <div key={option.id}>
                    <strong>{option.optionTextKz}</strong>
                    <p>{option.poll_votes?.length || 0} голосов</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Кнопка удаления */}
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => handleDeletePoll(poll.id)}
            >
              Удалить голосование
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default PollList;
