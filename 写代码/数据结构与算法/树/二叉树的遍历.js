const tree = require('./实现一个二叉树');
// 二叉树遍历时，每个节点最多被访问2词，因此遍历的时间复杂度与节点个数成正比，其时间复杂度是O(n)。
// 先序遍历
function PreOrderTraversal(root) {
  if(!root) return;
  console.log(root.data);
  if(root.left){
    PreOrderTraversal(root.left);
  }
  if(root.right){
    PreOrderTraversal(root.right);
  }
}
// 中序遍历
function inOrderTraversal(root) {
  if(!root) return;
  if(root.left){
    inOrderTraversal(root.left);
  }
  console.log(root.data);
  if(root.right){
    inOrderTraversal(root.right);
  }
}
// 后序遍历
function nextOrderTraversal(root) {
  if(!root) return;
  if(root.left){
    nextOrderTraversal(root.left);
  }
  if(root.right){
    nextOrderTraversal(root.right);
  }
  console.log(root.data);
}

// 测试
console.log('先序遍历：');
PreOrderTraversal(tree.root)
console.log('中序遍历：');
inOrderTraversal(tree.root)
console.log('后序遍历：');
nextOrderTraversal(tree.root)