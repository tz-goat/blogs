// 打印二叉树
// 实例：
// 输入：root = [1,2,5,3,4,null,6]
// 输出：
// 1
// 2 5
// 3 4 6

const { TreeNode } = require('./index');

const root = new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), new TreeNode(4)),
    new TreeNode(5, null, new TreeNode(6))
);

// console.log(root);

/**
 * 创建 Mermaid 图
 * @param {*} root
 * @returns mermaid markdown
 */
function createMermaidGraph(root) {
    const tree = mermaid.createMermaidGraph(root);
    return tree;
}

const printNode = node => {
    if (!node) return;
    if (!node.left && !node.right) return;

    console.log(` ${node.val} => left: ${node.left?.val}`);
    console.log(` ${node.val} => right: ${node.right?.val}`);
};

module.exports = {
    printNode,
    createMermaidGraph,
};
