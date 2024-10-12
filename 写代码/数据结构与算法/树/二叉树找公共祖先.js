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