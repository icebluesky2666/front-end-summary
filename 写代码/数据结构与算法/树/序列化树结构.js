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
  return `_${head.data}` + leftStr + rightStr;
}
const serializationStr = serializationTree(tree.root);
console.log('序列化后：', serializationStr);

const deserialization = (str)=>{
  const arr = str.split('_');
  arr.shift();// 因为最前面有一个空字符
  console.log(arr)
  return deserializationProcess(arr);
}
const deserializationProcess = (arr) => {
  const node = arr.shift();
  if(node === '#'){
    return null;
  }
  let currentNode = new Node(node);
  currentNode.left = deserializationProcess(arr);
  currentNode.right = deserializationProcess(arr);
  return currentNode;
}
const nodeTree = deserialization(serializationStr)
console.log('反序列化后：', nodeTree);

const serializationStr1 = serializationTree(nodeTree);
console.log('再次序列化后：', serializationStr1);