import React, { useEffect, useState } from 'react';
import { fetchAnswers } from '../http/answerApi';
import { fetchPolls } from '../http/PollApi';
import { buildTree } from '../utils/treeUtils';
import { fetchNews } from '../http/newsApi';

/**
 * Дерево, в котором:
 *  - сначала показываем дерево answers (из buildTree),
 *  - затем "Голосования" отдельной веткой, со списком опросов.
 *  - затем "Новости" отдельной веткой
 */
const AnswerTree = () => {
  const [answerTree, setAnswerTree] = useState([]);
  const [pollTree, setPollTree] = useState([]);
  const [newsTree, setNewsTree] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]); // какие узлы раскрыты

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1) Загружаем ответы
      const ansData = await fetchAnswers();
      if (ansData && Array.isArray(ansData.rows)) {
        const treeData = buildTree(ansData.rows);
        setAnswerTree(treeData);
      }
      // 2) Загружаем опросы
      const pollsData = await fetchPolls();
      const pollNodes = pollsData.map((poll) => {
        // Формируем «дочерние» узлы — варианты
        const optionChildren = poll.poll_options.map((opt) => ({
          id: `option_${opt.id}`,
          quest: `(${opt.id}) ${opt.optionTextRu} / ${opt.optionTextKz}`,
          children: [] // у опций больше нет вложений
        }));
        // Сам poll как узел
        return {
          id: `poll_${poll.id}`,
          quest: `Poll #${poll.id}: ${poll.questionRu} / ${poll.questionKz}`,
          children: optionChildren
        };
      });
      // Оборачиваем единым виртуальным родителем "Голосования"
      // Можно дать ему любой ID (например, -100)
      const pollTreeRoot = [
        {
          id: 'poll_root',
          quest: 'Голосования',
          children: pollNodes
        }
      ];
      setPollTree(pollTreeRoot);

      //3) Загружаем новости
      const newsData = await fetchNews();
      const newsNodes = newsData.map(newsItem => ({
        id: `news_${newsItem.id}`,
        quest: newsItem.topic,
        children: [] // новости без вложенных элементов
      }));
      const newsTreeRoot = [
        {
          id: 'news_root',
          quest: 'Новости',
          children: newsNodes
        }
      ];
      setNewsTree(newsTreeRoot);

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const renderTree = (nodes) => {
    return (
      <ul style={{ listStyleType: 'none', marginLeft: '20px' }}>
        {nodes.map(node => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedNodes.includes(node.id);

          return (
            <li key={node.id} style={{ margin: '5px 0' }}>
              <div
                style={{ cursor: hasChildren ? 'pointer' : 'default' }}
                onClick={() => hasChildren && toggleNode(node.id)}
              >
                {hasChildren && (
                  <span style={{ marginRight: '5px' }}>
                    {isExpanded ? '[-]' : '[+]'}
                  </span>
                )}
                {node.quest}
              </div>
              {hasChildren && isExpanded && renderTree(node.children)}
            </li>
          );
        })}
      </ul>
    );
  };

  // Комбинируем дерево ответов + дерево голосований
  const combinedTree = [
    ...answerTree,
    ...pollTree,
    ...newsTree
  ];

  return (
    <div>
      <h2>Общее дерево (Ответы + Голосования + Новости)</h2>
      {combinedTree.length > 0 ? renderTree(combinedTree) : <p>No data</p>}
    </div>
  );
};

export default AnswerTree;
