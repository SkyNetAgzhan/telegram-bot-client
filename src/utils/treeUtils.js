// src/utils/treeUtils.js

export const buildTree = (answers, parentId = null) => {
    const tree = [];
    answers.forEach(answer => {
        if (answer.parentid === parentId) {
            const children = buildTree(answers, answer.id);
            if (children.length) {
                answer.children = children;
            } else {
                answer.children = [];
            }
            tree.push(answer);
        }
    });
    return tree;
};
