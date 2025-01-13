const { root } = require('./index');
const { printNode } = require('./printTree');

const BFS = rootNode => {
    const queue = [rootNode];
    while (queue.length) {
        const node = queue.shift();
        printNode(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
};

BFS(root);
