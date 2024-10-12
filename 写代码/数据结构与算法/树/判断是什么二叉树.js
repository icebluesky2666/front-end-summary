// 判断是否是搜索二叉树
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
// 判断是完全二叉树
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
// 判断是满二叉树
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