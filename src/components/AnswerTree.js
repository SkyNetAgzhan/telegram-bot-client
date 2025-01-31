import React, { useEffect, useState } from 'react';
import { fetchAnswers } from '../http/answerApi';
import { fetchPolls } from '../http/PollApi';
import { buildTree } from '../utils/treeUtils';

/**
 * Дерево, в котором:
 *  - сначала показываем дерево answers (из buildTree),
 *  - затем "ГОЛОСОВАНИЯ" отдельной веткой, со списком опросов.
 */
const AnswerTree = () => {
  const [answerTree, setAnswerTree] = useState([]);
  const [pollTree, setPollTree] = useState([]);
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
      // Превратим их в "дерево" вида: 
      //  { id:'poll_x', quest:'Вопрос ???', children: [ {id:'option_1', quest:'Опция 1'}, ...] }
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
      // Оборачиваем единым виртуальным родителем "ГОЛОСОВАНИЯ"
      // Можно дать ему любой ID (например, -100)
      const pollTreeRoot = [
        {
          id: 'poll_root',
          quest: 'ГОЛОСОВАНИЯ',
          children: pollNodes
        }
      ];
      setPollTree(pollTreeRoot);
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
    ...pollTree
  ];

  return (
    <div>
      <h2>Общее дерево (Ответы + Голосования)</h2>
      {combinedTree.length > 0 ? renderTree(combinedTree) : <p>No data</p>}
    </div>
  );
};

export default AnswerTree;
