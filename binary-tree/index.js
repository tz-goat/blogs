function TreeNode(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
}

const root = new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), new TreeNode(4)),
    new TreeNode(5, null, new TreeNode(6))
);

module.exports = {
    TreeNode,
    root,
};

// to-do: turn output array into mermaid graph to verify the result
