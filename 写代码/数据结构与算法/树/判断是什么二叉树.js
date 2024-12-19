// 判断是否是搜索二叉树
// 左子树上所有节点的值均小于根节点的值。
// 右子树上所有节点的值均大于根节点的值。
// 左、右子树也分别是搜索二叉树。
// 8
// / \
// 3   10
// / \    \
// 1   6    14
// / \   /
// 4   7 13
// 不对
function isSearchTree(head){
  if(!head){
    return null;
  }
  let left = isSearchTree(head.left);
  let right = isSearchTree(head.right);

  let isSearch = true;
  let min = head.value;
  let max = head.value;
  if(left){
    min = Math.min(left.min);
    max = Math.min(left.max);
  }
  if(right){
    min = Math.min(right.min);
    max = Math.min(right.max);
  }
  if(!left.isSearch || !right.isSearch || (left && right && !(left.max < head.value && head.value < right.min))){
    isSearch = false
  }
  return {
    isSearch,
    min,
    max,
  };
}
// 不对
function isSearchTree2(head){
  let pre = Number.MIN_SAFE_INTEGER;
  let stack = [head];
  let current = head;
  let isSearch = true;
  while(stack.length){
    if(current.left){
      stack.push(current.left);
      current = current.left;
    }else{
      current = stack.pop();
      if(current < pre){
        isSearch = false;
        break;
      }
      if(current.right){
        current = current.right;
      }
    }
  }
  return isSearch;
}
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
// 思路： 不断递归将每个节点绑定三个信息，最小值，最大值，是否是搜索树，不断向上回朔
var poartiner = function(root) {
    if(!root){
      return {
        max: null,
        min: null,
        isBST: true
      };
    }
    let leftMsg = poartiner(root.left);
    let rightMsg = poartiner(root.right);
    let isBST = false;
    if(leftMsg.isBST && rightMsg.isBST){
      if((!root.left || root.left.val < root.val) && (!root.right || root.right.val > root.val)
      ){
        if(( leftMsg.max === null || leftMsg.max < root.val) && (rightMsg.min === null || rightMsg.min > root.val)){
          isBST = true
        }
      }
    }
    return {
      min: leftMsg.min === null? root.val: Math.min(root.val, leftMsg.min),
      max: rightMsg.max === null? root.val: Math.max(root.val, rightMsg.max),
      isBST,
    };
};
// 思路：搜索二叉树的每个子树都要满足在一个区间内，左子树最小值～root.val   右子树root.val~最大值
var poartiner = function(root, min = -Infinity, max= +Infinity) {
    if(!root){
      return true;
    }
    if(root.val <= min || root.val>=max){
      return false;
    }
    return poartiner(root.left, min, root.val) && poartiner(root.right, root.val, max)
};
// 判断是完全二叉树
// 完全二叉树是一种特殊的二叉树，除了最后一层外，所有层的节点都是满的，并且最后一层的所有节点都尽可能地靠左排列。
// 1
// / \
// 2   3
// / \  /
// 4  5 6
function inAllTree(head){
  const arr = [head];
  const p1 = flase;
  while(arr.length){
    const current = arr.shift();
    // if(current.right && !current.left){
    //   flag = false;
    //   break;
    // }else if(!(current.right && current.left)){
    //   if(!p1){
    //     p1 = true;
    //   }
    //   if(current.left) arr.push(current.left);
    // }else if(!current.right && !current.left){
    //   if(p1){
    //     flag = false;    
    //     break;
    //   }
    // }
    if((p1 && (current.left || current.right)) || (!current.left && current.right)){
      return false;
    }
    if(current.left){
      arr.push(current.left)
    }
    if(current.right){
      arr.push(current.right)
    }
    if(!current.left || !current.right){
      p1 = true
    }
  }
  return flag;
}
function isinAllTree(root){
  let stack = [head];
  let flagRoot = null;
  let res = true;
  while(stack.length > 0){
    let currentRoot = stack.shift();
    if((!currentRoot.left || currentRoot.right) && !(!currentRoot.left && currentRoot.right) && !flagRoot){
      flagRoot = currentRoot;
      continue;
    }
    if(flagRoot && (currentRoot.left || currentRoot.right)){
      res = false;
      break;
    }
    currentRoot.left && stack.push(currentRoot.left);
    currentRoot.right && stack.push(currentRoot.right);
  }
  return res;
}
// 判断是满二叉树
// 满二叉树是一种特殊的二叉树，其中每个节点要么是叶子节点，要么有两个子节点。
// 1
// / \
// 2   3
// / \ / \
// 4  5 6  7
// 不对
function isAutoTree(head){
  const arr = [head];
  const flag = false;
  while(arr.length){
    const current = arr.shift();
    if((!current.left && current.right) || (current.left && !current.right) || (flag && (current.left || current.right))){
      return false;
    }
    if(current.left) arr.push(current.left);
    if(current.right) arr.push(current.right);
    if(!current.left && !current.right){
      flag = true;
    }
  }
}
// 利用左子树高度等于右子树高度，并且所有子树都是auto进行信息回朔
function isAutoTree2(head){
  if(!head){
    return {
      isAuto: true,
      height: 0
    }
  }
  let leftTree = isAutoTree(head.left);
  let rightTree = isAutoTree(head.right);
  // 关键
  let isAuto = true;
  let height = 0;
  if(!leftTree.isAuto || !rightTree.isAuto || leftTree.height !== rightTree.height){
    isAuto = false
  }
  height = Math.max(leftTree.height, rightTree.height) + 1;
  return {
    isAuto,
    height
  }
}
// 层序便利第一个不满的节点应该是最后一层，并且后面的节点左右都为空进行判断
function isAutoTree3(head){
 let stack = [head];
 let levalMap = new Map();
 levalMap.set(head, 1);
 let levalisAuto = [];
 while(stack.length > 0 ){
    let currentRoot = stack.shift();
    let currentLeval = levalMap.get(currentRoot)
    let flagRoot = null;
    let res = true;
    if(currentRoot.left || currentRoot.right){
      levalisAuto[currentLeval] = true;
    }
    if(!flagRoot && !(currentRoot.left && currentRoot.right)){
      if(!currentRoot.left && !currentRoot.right && !levalisAuto[currentLeval]){
        flagRoot = currentRoot;
      }else{
        res = false;
      }
    }else{
      if(currentRoot.left || currentRoot.right){
        res = false;
      }
    }
    if(currentRoot.left){
      stack.push(currentRoot.left);
      levalMap.set(currentRoot.left, currentLeval + 1)
    }
    if(currentRoot.right){
      stack.push(currentRoot.right);
      levalMap.set(currentRoot.right, currentLeval + 1)
    }
 }
 return res;
} 
//判断是平衡二叉树：平衡二叉树是左右子树都是平衡的，并且左子树与右子树的高度差必须小于等于一
function isBalancedTree(head){
  if(!head){
    return {height: 0, isBalanced: true};
  }
  const left = isBalancedTree(head.left);
  const right = isBalancedTree(head.right);
  const height = Math.max(left.height, right.height) + 1;
  const isBalanced = left.isBalanced && right.isBalanced && (Math.abs(left.height - right.height) <= 1);
  return {height, isBalanced};
}