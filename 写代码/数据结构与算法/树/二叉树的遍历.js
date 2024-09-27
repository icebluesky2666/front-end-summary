const tree = require('./实现一个二叉树');
// 二叉树遍历时，每个节点最多被访问2词，因此遍历的时间复杂度与节点个数成正比，其时间复杂度是O(n)。
// 先序遍历
function PreOrderTraversal(root) {
  console.log(root.data);
  if (root.left) PreOrderTraversal(root.left);
  if (root.right) PreOrderTraversal(root.right);
}
function PreOrderTraversalNoRecursion(root) {
  const stack = [root];
  while(stack.length){
    let node = stack.pop();
    console.log(node.data);
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }
}
// 中序遍历
// 中序遍历二叉查找树，可以输出有序的数据序列，时间复杂度是O(n)，非常高效。因此二叉查找树又叫二叉排序树。
function inOrderTraversal(root) {
  if(root.left) inOrderTraversal(root.left);
  console.log(root.data);
  if(root.right) inOrderTraversal(root.right);
}
function inOrderTraversalNoRecursion(root) {
  const stack = [];
  let current = root;
  while(stack.length || current){
    // 持续遍历左
    while(current){
      stack.push(current)
      current = current.left;
    }
    // 输出中
    current = stack.pop();
    console.log(current.data);
    // 右子树
    current = current.right;
  }
}
// 后序遍历
function nextOrderTraversal(root) {
  if(root.left) nextOrderTraversal(root.left);
  if(root.right) nextOrderTraversal(root.right);
  console.log(root.data);
}
function nextOrderTraversalNoRecursion(root) {
  let stack = [root];
  let stack2 = [];
  while(stack.length){
    let current = stack.pop();
    stack2.push(current);
    if(current.left) stack.push(current.left);
    if(current.right) stack.push(current.right);
  }
  stack2.reverse().forEach((val)=>{
    console.log(val.data)
  })
}
// 层序遍历
function leavlOrderTraversal(root) {
  const stack = [root];
  while(stack.length){
    let root = stack.shift();
    console.log(root.data);
    if(root.left) stack.push(root.left);
    if(root.right) stack.push(root.right);
  }

}
// 二叉树的最大宽度（层序遍历比较最宽的个数2种方法）
function getWightTree(root){// Hash
  const stack = [root];
  const nodeMap = new Map();
  let currentLeval = 1;
  let currentLevalNum = 0;
  nodeMap.set(root, 1)
  while(stack.length){
    let current = stack.shift();
    if(current.left) {
      stack.push(current.left);
      nodeMap.set(root, currentLeval + 1)
    }
    if(current.right) {
      stack.push(current.right);
      nodeMap.set(root, currentLeval + 1)
    }
  }
}
// 测试
console.log('先序遍历：');
PreOrderTraversal(tree.root)
console.log('先序遍历2：');
PreOrderTraversalNoRecursion(tree.root)
console.log('中序遍历：');
inOrderTraversal(tree.root)
console.log('中序遍历2：');
inOrderTraversalNoRecursion(tree.root)
console.log('后序遍历：');
nextOrderTraversal(tree.root);
console.log('后序遍历2：');
nextOrderTraversalNoRecursion(tree.root)
console.log('层序遍历：');
leavlOrderTraversal(tree.root)

