// // 中序遍历的后继节点
// 给定一棵二叉搜索树和其中的一个节点 p ，找到该节点在树中的中序后继。如果节点没有中序后继，请返回 null 。

// 节点 p 的后继是值比 p.val 大的节点中键值最小的节点，即按中序遍历的顺序节点 p 的下一个节点。
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @return {TreeNode}
 */
var inorderSuccessor = function(root, p) {
  if(p.right){
      // 有右子树为右子树的最左节点
      let node = p.right;
      while(node.left){
          node = node.left
      }
      return node;
  }else{
      // 没有右子树，为父节点中，将自己当作左孩子的节点
      let node = getLeftParents(root, p)
      return node.target;
  }
};
// 查找p是谁的左节点
function getLeftParents(root, p){
  if(!root){
      return {
          hasP: false,
          target: null
      }
  }
  let leftMsg = getLeftParents(root.left, p);
  let rightMsg = getLeftParents(root.right, p);
  let hasP = false;
  let target = null;
  if(leftMsg.hasP || rightMsg.hasP || root === p){
      hasP = true;
  }
  if(leftMsg.target || rightMsg.target){
      target = leftMsg.target?leftMsg.target:rightMsg.target;
  }else{
      if(leftMsg.hasP){
          target = root
      }
  }
  return {
      hasP,
      target
  }
}

// 一条纸对折n次输出折痕顺序
function getArrayList(n){
  process(1, n, true);
}
function process(current, n, flag){
  if(current > n){
    return;
  }
  process(current+1, n, true);
  console.log(flag?'凹':'凸');
  process(current+1, n, false);
}
getArrayList(3)


