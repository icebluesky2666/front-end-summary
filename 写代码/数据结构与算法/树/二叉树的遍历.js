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
// 中序遍历二叉查找树，可以输出有序的数据序列，时间复杂度是O(n)，非常高效。因此二叉查找树又叫二叉排序树。
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
// 层序遍历
function leavlOrderTraversal(root) {
  if(!root) return;
  let arr = [root];
  while(arr.length > 0){
    let node = arr.shift()
    console.log(node.data);
    if(node.left) arr.push(node.left)
    if(node.right) arr.push(node.right)
  }
}
// 测试
console.log('先序遍历：');
PreOrderTraversal(tree.root)
console.log('中序遍历：');
inOrderTraversal(tree.root)
console.log('后序遍历：');
nextOrderTraversal(tree.root);
console.log('层序遍历：');
leavlOrderTraversal(tree.root)
