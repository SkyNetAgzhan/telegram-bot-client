import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

import { fetchAnswers, createAnswer, deleteAnswer, swapCategoriesAndSubs } from '../http/answerApi';

// Пример: константы для "глобальных" родительских ID:
const RUSSIAN_ROOT = 2;
const KAZAKH_ROOT = 3;

/**
 * Пример компонента: показывает 
 * 1) Только категории, у которых parentid = 2 или 3 
 * 2) Рекурсивно внутри — подкатегории и документы (isnode=true / isnode=false) 
 * 3) Возможность создать/удалить "Голосование"/"Дауыс беру" (answer="poll_trigger") 
 * 4) Возможность свапнуть категории
 */
const Answer = observer(() => {
  const { answer } = useContext(Context);

  // Для свапа:
  const [swapA, setSwapA] = useState('');
  const [swapB, setSwapB] = useState('');

  // Для "глобальных" сообщений об ошибках и т.д.
  const [info, setInfo] = useState('');

  useEffect(() => {
    loadAllAnswers();
  }, []);

  const loadAllAnswers = async () => {
    try {
      const data = await fetchAnswers();    // { rows: [...], count: ... }
      answer.setAnswers(data);              // теперь answer.answers = data.rows (массив)
    } catch (err) {
      console.error('Ошибка при загрузке answers:', err);
    }
  };

  // Фильтруем "корневые" категории, у кого parentid = 2 или 3
  // Это массив записей (isnode=true обычно, но вы можете проверить).
  const topCategories = answer.answers.filter(
    (cat) => (cat.parentid === RUSSIAN_ROOT || cat.parentid === KAZAKH_ROOT)
  );

  /**
   * Рекурсивная функция, которая возвращает массив <tr> для всех подчинённых (и их детей).
   * - `parentId` : число (ID родителя)
   * - `level` : уровень вложенности (чтобы управлять отступами или стилями)
   */
  const renderRowsRecursive = (parentId, level = 0) => {
    // Находим всех "детей" (isnode= false/true) данного parentId
    const children = answer.answers.filter(item => item.parentid === parentId);

    // Для каждого ребёнка:
    //   - если isnode=true (подкатегория без документа), покажем (quest, "Категория")
    //   - если isnode=false (с документом), тоже отобразим (quest, "Документ", fileName, и т.д.)
    // рекурсивно добавим детей, если isnode=true
    const rows = [];
    children.forEach(child => {
      const indentStyle = { paddingLeft: `${20 * level}px` };

      rows.push(
        <tr key={child.id}>
          <td>{child.id}</td>
          <td style={indentStyle}>
            {child.quest}
            {child.isnode
              ? <span style={{color:'grey'}}> (категория)</span> 
              : <span style={{color:'blue'}}> (документ)</span>
            }
          </td>
          <td>{child.answer}</td>
          <td>
            {/* Кнопка удаления */}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(child.id)}
            >
              Удалить
            </Button>
          </td>
        </tr>
      );

      // Если это категория (isnode=true), у неё могут быть свои подкатегории => рекурсия
      if (child.isnode) {
        const subRows = renderRowsRecursive(child.id, level + 1);
        rows.push(...subRows);
      }
    });
    return rows;
  };

  // Удалить запись
  const handleDelete = async (id) => {
    if (!window.confirm('Точно удалить запись #' + id + '?')) return;
    try {
      await deleteAnswer(id);
      // Локально обновляем store (или заново загружаем)
      loadAllAnswers();
      setInfo(`Запись #${id} удалена`);
    } catch (err) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  // === Создать/удалить "Голосование" (рус) или "Дауыс беру" (каз) ===
  const createPollTrigger = async (lang) => {
    // lang='ru' => "Голосование", parentid=2
    // lang='kz' => "Дауыс беру", parentid=3
    let quest = (lang === 'ru') ? 'Голосование' : 'Дауыс беру';
    let parent = (lang === 'ru') ? RUSSIAN_ROOT : KAZAKH_ROOT;
    const formData = new FormData();
    formData.append('quest', quest);
    formData.append('answer', 'poll_trigger');
    formData.append('answertype', 'poll');
    formData.append('isnode', false);  // не папка, а триггер
    formData.append('parentid', parent);

    try {
      await createAnswer(formData);
      loadAllAnswers();
      setInfo(`Создано "${quest}"`);
    } catch (err) {
      alert('Ошибка при создании: ' + err.message);
    }
  };

  const deletePollTrigger = async (lang) => {
    // Найдём запись, где quest="Голосование" или "Дауыс беру" 
    // (parentid=2 или 3, answer="poll_trigger")
    let quest = (lang === 'ru') ? 'Голосование' : 'Дауыс беру';
    const candidate = answer.answers.find(a =>
      a.quest === quest && a.answer === 'poll_trigger'
    );
    if (!candidate) {
      alert(`Не найдена запись "${quest}"!`);
      return;
    }
    if (!window.confirm(`Удалить "${quest}" (#${candidate.id})?`)) return;
    try {
      await deleteAnswer(candidate.id);
      loadAllAnswers();
      setInfo(`Удалено "${quest}" (#${candidate.id})`);
    } catch (err) {
      alert('Ошибка при удалении poll trigger: ' + err.message);
    }
  };

  // === Свап категории ===
  // Пример: если user вводит idA, idB => вызовем swapCategoriesAndSubs
  const handleSwap = async () => {
    if (!swapA || !swapB) {
      alert('Введите оба ID для свапа.');
      return;
    }
    if (parseInt(swapA) === parseInt(swapB)) {
      alert('ID категорий не должны совпадать.');
      return;
    }
    if (!window.confirm(`Поменять местами категории #${swapA} и #${swapB}?`)) {
      return;
    }
    try {
      await swapCategoriesAndSubs(swapA, swapB);
      loadAllAnswers();
      setSwapA('');
      setSwapB('');
      setInfo(`Свапнуты категории #${swapA} и #${swapB}`);
    } catch (err) {
      alert('Ошибка при свапе: ' + err.message);
    }
  };

  return (
    <Container>
      <h2 style={{marginTop: '15px'}}>Список категорий (parentid=2 или 3)</h2>
      {info && <p style={{ color: 'blue' }}>{info}</p>}

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
        <h5>Управление "Голосование" / "Дауыс беру"</h5>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline-primary" onClick={() => createPollTrigger('ru')}>Создать "Голосование" (рус)</Button>
          <Button variant="outline-primary" onClick={() => createPollTrigger('kz')}>Создать "Дауыс беру" (каз)</Button>
          <Button variant="outline-danger" onClick={() => deletePollTrigger('ru')}>Удалить "Голосование" (рус)</Button>
          <Button variant="outline-danger" onClick={() => deletePollTrigger('kz')}>Удалить "Дауыс беру" (каз)</Button>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
        <h5>Поменять местами категорий</h5>
        <p>Введите два ID категорий и нажмите "Swap".</p>
        <div style={{ display: 'flex', gap: '10px', alignItems:'center' }}>
          <Form.Control
            style={{ width:'80px' }}
            placeholder="ID A"
            value={swapA}
            onChange={e => setSwapA(e.target.value)}
          />
          <Form.Control
            style={{ width:'80px' }}
            placeholder="ID B"
            value={swapB}
            onChange={e => setSwapB(e.target.value)}
          />
          <Button variant="warning" onClick={handleSwap}>Swap</Button>
        </div>
      </div>

      {/** Выводим список корневых категорий (parentid=2 или 3) */}
      {topCategories.map(cat => (
        <div key={cat.id} style={{ marginBottom:'40px' }}>
          <h3>Категория id={cat.id} — {cat.quest}</h3>
          <Table bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название (quest)</th>
                <th>answer (имя файла?)</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {/** Cама категория (корневая) - тоже показываем как строку? */}
              <tr>
                <td>{cat.id}</td>
                <td>
                  {cat.quest}
                  <span style={{color:'grey'}}> (корневая категория)</span>
                </td>
                <td>{cat.answer}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>

              {/** Рекурсивно подчинённые (и их дети) */}
              {renderRowsRecursive(cat.id, 1)}
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
  );
});

export default Answer;
