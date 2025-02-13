// src/pages/BotAnalytics.js
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { fetchBotAnalytics } from '../http/analyticsApi';

function BotAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  const handleGetAnalytics = async () => {
    setError('');
    try {
      // Предположим, бэкенд крутится на http://localhost:5000
      // и у вас есть GET /api/analytics/bot, который возвращает:
      // { totalUniqueUsers: N, todayUniqueUsers: M }
      const data = await fetchBotAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Аналитика бота</h2>

      <Button variant="outline-primary" onClick={handleGetAnalytics}>
        Загрузить статистику
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {analytics && (
        <div style={{ marginTop: '10px' }}>
          <p>Всего уникальных посетителей: <strong>{analytics.totalUniqueUsers}</strong></p>
          <p>Уникальных посетителей за сегодня: <strong>{analytics.todayUniqueUsers}</strong></p>
        </div>
      )}
    </div>
  );
}

export default BotAnalytics;
