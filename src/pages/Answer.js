import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';

// Импорт методов для CRUD и свапов
import {
  fetchAnswers,
  deleteAnswer,
  createAnswer,
  swapCategoriesAndSubs,
  swapSubs
} from '../http/answerApi';

// Импортируем компонент дерева
import AnswerTree from '../components/AnswerTree';

const RUSSIAN_ROOT = 2;
const KAZAKH_ROOT = 3;

const Answer = observer(() => {
  const { answer } = useContext(Context);

  // Состояния
  const [swapA, setSwapA] = useState('');
  const [swapB, setSwapB] = useState('');
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [info, setInfo] = useState('');

  useEffect(() => {
    loadAllAnswers();
  }, []);

  const loadAllAnswers = async () => {
    try {
      const data = await fetchAnswers(); 
      answer.setAnswers(data); // теперь answer.answers = data.rows
    } catch (err) {
      console.error('Error loading answers:', err);
    }
  };

  const topCategories = answer.answers.filter(
    cat => cat.parentid === RUSSIAN_ROOT || cat.parentid === KAZAKH_ROOT
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить запись id=' + id + '?')) return;
    try {
      await deleteAnswer(id);
      loadAllAnswers();
      setInfo(`Запись id=${id} удалена`);
    } catch (err) {
      alert('Ошибка при удалении: ' + err.message);
    }
  };

  // == Логика "Swap sub" ==
  const handleSubSwapClick = async (thisSubId) => {
    // Если ничто не выбрано — выбираем
    if (!selectedSubId) {
      setSelectedSubId(thisSubId);
      setInfo(`Подкатегория id=${thisSubId} выбрана для свапа. Теперь выберите вторую.`);
      return;
    }

    // Если пользователь нажал на ту же подкатегорию, сбрасываем
    if (selectedSubId === thisSubId) {
      setSelectedSubId(null);
      setInfo('Отменён выбор подкатегории, свап отменён.');
      return;
    }

    // Иначе пытаемся свапать две разные
    if (!window.confirm(`Свап подкатегорий id=${selectedSubId} и id=${thisSubId}?`)) {
      return;
    }
    try {
      await swapSubs(selectedSubId, thisSubId);
      loadAllAnswers();
      setInfo(`Swap sub id=${selectedSubId} и id=${thisSubId} выполнен`);
    } catch (err) {
      alert('Ошибка при swapSubs: ' + err.message);
    } finally {
      // сбрасываем выбор
      setSelectedSubId(null);
    }
  };


  // Рендер рекурсивных строк
  const renderRowsRecursive = (parentId, level = 0) => {
    const children = answer.answers.filter(item => item.parentid === parentId);
    let rows = [];

    children.forEach(child => {
      const styleIndent = { paddingLeft: `${20 * level}px` };
      // Если child.id = selectedSubId => подсветим (variant="success")
      const isSelected = (child.id === selectedSubId);

      rows.push(
        <tr key={child.id}>
          <td>{child.id}</td>
          <td style={styleIndent}>
            {child.quest}
            {child.isnode
              ? <span style={{color: 'gray'}}> (категория)</span>
              : <span style={{color: 'blue'}}> (документ)</span>
            }
          </td>
          <td>{child.answer}</td>
          <td style={{ textAlign: 'center' }}>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(child.id)}
              style={{ marginRight: '8px' }}
            >
              Удалить
            </Button>

            <Button
              variant={isSelected ? "success" : "secondary"}
              size="sm"
              onClick={() => handleSubSwapClick(child.id)}
            >
              Swap sub
            </Button>
          </td>
        </tr>
      );

      if (child.isnode) {
        rows = rows.concat(renderRowsRecursive(child.id, level + 1));
      }
    });

    return rows;
  };

  // == Swap категорий ==
  const handleSwapCategories = async () => {
    if (!swapA || !swapB) {
      alert('Укажите оба ID для свапа категорий');
      return;
    }
    if (parseInt(swapA) === parseInt(swapB)) {
      alert('ID категорий не должны совпадать');
      return;
    }
    if (!window.confirm(`Swap категорий id=${swapA} и id=${swapB}?`)) return;

    try {
      await swapCategoriesAndSubs(swapA, swapB);
      loadAllAnswers();
      setInfo(`Swap категорий id=${swapA} и id=${swapB} выполнен`);
      setSwapA('');
      setSwapB('');
    } catch (err) {
      alert('Ошибка swapCategories: ' + err.message);
    }
  };

  // == Создать / Удалить "Голосование" ==
  const createPollTrigger = async (lang) => {
    const parentId = (lang === 'ru') ? RUSSIAN_ROOT : KAZAKH_ROOT;
    const quest = (lang === 'ru') ? 'Голосование' : 'Дауыс беру';
    const formData = new FormData();
    formData.append('quest', quest);
    formData.append('answer', 'poll_trigger');
    formData.append('answertype', 'poll');
    formData.append('isnode', false);
    formData.append('parentid', parentId);

    try {
      await createAnswer(formData);
      loadAllAnswers();
      setInfo(`Создано "${quest}"`);
    } catch (err) {
      alert('Ошибка create poll_trigger: ' + err.message);
    }
  };

  const deletePollTrigger = async (lang) => {
    const quest = (lang === 'ru') ? 'Голосование' : 'Дауыс беру';
    const candidate = answer.answers.find(a =>
      a.quest === quest && a.answer === 'poll_trigger'
    );
    if (!candidate) {
      alert(`Не найдена запись "${quest}"`);
      return;
    }
    if (!window.confirm(`Удалить "${quest}" (id=${candidate.id})?`)) return;

    try {
      await deleteAnswer(candidate.id);
      loadAllAnswers();
      setInfo(`Удалено "${quest}" (id=${candidate.id})`);
    } catch (err) {
      alert('Ошибка удаления poll_trigger: ' + err.message);
    }
  };

  return (
    <Container>
      {/* Дерево сверху */}
      <AnswerTree />

      <h2>Создание кнопки Голосование</h2>
      {info && <p style={{ color: 'blue' }}>{info}</p>}

      <div style={{ border:'1px solid #ccc', padding:'10px', marginBottom:'15px' }}>
        <h5>Создать / Удалить "Голосование" (рус) / "Дауыс беру" (каз)</h5>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <Button variant="outline-primary" onClick={() => createPollTrigger('ru')}>
            Создать "Голосование"
          </Button>
          <Button variant="outline-primary" onClick={() => createPollTrigger('kz')}>
            Создать "Дауыс беру"
          </Button>
          <Button variant="outline-danger" onClick={() => deletePollTrigger('ru')}>
            Удалить "Голосование"
          </Button>
          <Button variant="outline-danger" onClick={() => deletePollTrigger('kz')}>
            Удалить "Дауыс беру"
          </Button>
        </div>
      </div>

      <div style={{ border:'1px solid #ccc', padding:'10px', marginBottom:'15px' }}>
        <h5>Поменять местами категории (idA, idB)</h5>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <Form.Control
            style={{ width: '80px' }}
            placeholder="ID A"
            value={swapA}
            onChange={e => setSwapA(e.target.value)}
          />
          <Form.Control
            style={{ width: '80px' }}
            placeholder="ID B"
            value={swapB}
            onChange={e => setSwapB(e.target.value)}
          />
          <Button variant="warning" onClick={handleSwapCategories}>
            Swap
          </Button>
        </div>
        <div style={{ color:'gray', fontSize:'small' }}>
          (Внимание: здесь можно менять только корневые категории!)
        </div>
      </div>

      {topCategories.map(cat => (
        <div key={cat.id} style={{ marginBottom:'30px' }}>
          <h3>Категория id={cat.id}: {cat.quest}</h3>
          <Table bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название (quest)</th>
                <th>answer</th>
                <th style={{ textAlign:'center' }}>Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cat.id}</td>
                <td>
                  {cat.quest}
                  <span style={{ color:'gray' }}> (корень)</span>
                </td>
                <td>{cat.answer}</td>
                <td style={{ textAlign:'center' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>

              {renderRowsRecursive(cat.id, 1)}
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
  );
});

export default Answer;
