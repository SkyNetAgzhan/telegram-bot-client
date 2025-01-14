import React, { useEffect, useState } from 'react';
import { fetchAnswers } from '../http/answerApi'; 
import { buildTree } from '../utils/treeUtils'; 

const AnswerTree = () => {
    const [tree, setTree] = useState([]);

    useEffect(() => {
        const getAnswers = async () => {
            try {
                const data = await fetchAnswers();
                console.log('Fetched answers response:', data);
                if (data && Array.isArray(data.rows)) {
                    const answers = data.rows;
                    console.log('Extracted answers:', answers);
                    const treeData = buildTree(answers);
                    console.log('Built tree:', treeData); 
                    setTree(treeData);
                } else {
                    console.error('Fetched answers is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };
        getAnswers();
    }, []);

    const renderTree = (nodes) => (
        <ul>
            {nodes.map(node => (
                <li key={node.id}>
                    {node.quest}
                    {node.children && node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <h1>Дерево ответов</h1>
            {tree.length > 0 ? renderTree(tree) : <p>No data available</p>}
        </div>
    );
};

export default AnswerTree;
