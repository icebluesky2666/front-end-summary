const tree = require('./实现一个二叉树');
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
const serializationTree = (head)=>{
 if(!head){
  return '_#'
 }
 const leftStr = serializationTree(head.left);
 const rightStr = serializationTree(head.right);
 return leftStr + `_${head.data}` + rightStr;
}
const serializationStr = serializationTree(tree.root);
console.log('序列化后：', serializationStr);

const deserialization = (str)=>{
  const arr = str.split('_');
  arr.shift();// 因为最前面有一个空字符
  deserializationProcess(arr);
}
const deserializationProcess = (arr) => {
  const node = arr.shift();
  if(node === '#'){
    return null;
  }
  nodeLeft = new Node(node.data);
  nodeHead = deserializationProcess(arr);
  nodeHead.left = nodeLeft;
  nodeHead.right = deserializationProcess(arr);
  return nodeHead;
}
const nodeTree = deserialization(serializationStr)
console.log('反序列化后：', nodeTree);

const serializationStr1 = serializationTree(nodeTree);
console.log('再次序列化后：', serializationStr1);