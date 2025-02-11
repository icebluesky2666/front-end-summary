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
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  const res = getCommonParentsNode(root, p, q);
  console.log(res.targetNode)
  return res.targetNode;
};
function getCommonParentsNode(head, node1, node2){
  if(!head){
    return {
      hasNode1: false,
      hasNode2:false,
      targetNode: null
    }
  }
  const left = getCommonParentsNode(head.left, node1, node2);
  const right = getCommonParentsNode(head.right, node1, node2);
  let hasNode1 = false;
  let hasNode2 = false;
  let targetNode = null;  
  if(left.hasNode1 || right.hasNode1 || head.val == node1.val){
    hasNode1 = true;
  }
  if(left.hasNode2 || right.hasNode2 || head.val == node2.val){
    hasNode2 = true;
  }
  if(hasNode1 && hasNode2){
    targetNode = (!left.targetNode && !right.targetNode)?head:(left.targetNode?left.targetNode:right.targetNode)
  }
  // if((left.hasNode1 && right.hasNode2) || (left.hasNode2 && right.hasNode1) ){
  //   targetNode = head;
  // }
  // if(left.hasNode1 && !right.hasNode2 && head.val == node2.val){
  //   targetNode = head;
  // }
  // if(left.hasNode2 && !right.hasNode1 && head.val == node1.val){
  //   targetNode = head;
  // }
  // if(left.targetNode){
  //   targetNode = left.targetNode;
  // }
  // if(right.targetNode){
  //   targetNode = right.targetNode;
  // }
  return {
    hasNode1,
    hasNode2,
    targetNode,
  }
}

// 公共祖先
function getCommonParents(root, p1, p2){
  if(!root){
    return {
      hasP1: false,
      hasP2: false,
      targetNode: null
    }
  }
  let leftMsg = getCommonParents(root.left, p1, p2);
  let rightMsg = getCommonParents(root.right, p1, p2);

  let hasP1 = false;
  let hasP2 = false;
  let targetNode = null;
  if(leftMsg.hasP1 || rightMsg.hasP1 || root.val === p1.val){
    hasP1 = true;
  }
  if(leftMsg.hasP2 || rightMsg.hasP2 || root.val === p2.val){
    hasP2 = true;
  }
  if(hasP1 && hasP2){
    if(!leftMsg.targetNode && !rightMsg.targetNode){
      targetNode = root;
    }else{
      targetNode = leftMsg.targetNode?leftMsg.targetNode:rightMsg.targetNode;
    }
  }
  return {
    hasP1,
    hasP2,
    targetNode
  }
}

var lowestCommonAncestor = function(root, p, q) {
  if (root === null || root === p || root === q) {
      return root;
  }
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) {
      return root;
  }
  // 如果只在左子树或右子树中找到了 p 或 q，则返回找到的那个节点，节点下面的就不用找了，因为哪怕在下面最后的返回结果也是当前节点。
  return left ? left: right;
};
function Node(value){
  this.val = value;
} 
Node.prototype.left = null;
Node.prototype.right = null;

let a = new Node(0);
let b = new Node(1);
let c = new Node(2);
let d = new Node(3);
a.left = b;
b.left = c;
c.left = d;
console.log(getCommonParents(a,c,d)?.targetNode)
console.log(lowestCommonAncestor(a,c,d))

