// 前序遍历 DFS实现
// 力扣演练：https://leetcode.cn/problems/binary-tree-preorder-traversal/description/?envType=problem-list-v2&envId=binary-tree
const { root } = require('./index');
const { printNode } = require('./printTree');

const DFS = node => {
    if (!node) return;

    // 创建一个栈来存储节点
    const stack = [];
    // 将根节点推入栈中
    stack.push(node);

    while (stack.length > 0) {
        // 弹出当前节点
        const current = stack.pop();

        // 访问当前节点
        printNode(current);
        console.log(current.val);

        // 如果存在右子节点，将其推入栈中
        if (current.right) {
            stack.push(current.right);
        }

        // 如果存在左子节点，将其推入栈中
        if (current.left) {
            stack.push(current.left);
        }
    }
};

DFS(root);
