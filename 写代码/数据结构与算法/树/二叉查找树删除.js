const tree = require('./实现一个二叉树');

// 思路
// 删除节点有两个子节点，则删除用右侧最小的节点进行替换
// 删除节点有一个子节点，将子节点直接引用到删除节点
// 删除节点是最后的叶子节点，直接删除就可以



function deleteNodeFromTree(value, tree){
  let node = tree.root;
  let delNode = null;
  let parentNode = null;
  // 找到删除节点
  while(node){
    console.log(node.data,'     ', value)
    if(node.data === value){
      delNode = node;
      break;
    }
    if(node.data >= value){
      node = node.left;
    }else{
      node = node.right;
    }
    parentNode = node;
  }
  // while(node){
  //   if(node.data === value){
  //     delNode = node;
  //     break;
  //   }


  // }
  // function getNode(node){
  //   if(node.data === value){
  //     delNode = node;
  //     return;
  //   }
  //   getNode(node.left);
  //   getNode(node.right);
  // }
  if(!delNode){
    console.log('未找到删除节点')
    return;
  }
  // 三种情况
  if(!delNode.left && !delNode.right){
    if(parentNode.left === delNode){
      parentNode.left = null;
    }
    if(parentNode.right === delNode){
      parentNode.right = null;
    }
  }
  if(!delNode.left && delNode.right){
    if(parentNode.right === delNode){
      parentNode.right = delNode.right;
    }
  }
  if(delNode.left && !delNode.right){
    if(parentNode.left === delNode){
      parentNode.left = delNode.left;
    }
  }
  // 左右都存在
  if(delNode.left && delNode.right){
    // 寻找右子树的最小值交换
    let minNode = delNode.right;
    let minNodeParent = delNode;
    while(minNode.left){
     let tmpNode = minNode;
      minNode = minNode.left;
      if(minNode){
        minNodeParent = tmpNode;
      }
    }
    if(minNodeParent.left === minNode){
      minNodeParent.left = null;
    }
    if(minNodeParent.right === minNode){
      minNodeParent.right = null;
    }
    delNode.data = minNode.data;
  }
  return tree;
}
const res = deleteNodeFromTree(6, tree);
console.log('结果：', res)
console.log(1)