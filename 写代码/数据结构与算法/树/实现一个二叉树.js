// 定义node节点
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
// 定义树（实际上是一个二叉查找树）
class BinaryTree {
  constructor() {
    this.root = null;
  }
  // 插入节点
  insertNode(value){
    let newNode = new Node(value);
    if( this.root === null){
      this.root = newNode;
    }else{
      this.insertNodeHanlder(this.root, newNode);
    }
  }
  insertNodeHanlder(targetNode, newNode){
    if(newNode.data <= targetNode.data){
      if(targetNode.left === null){
        targetNode.left = newNode;
      }else{
        this.insertNodeHanlder(targetNode.left, newNode);
      }
    }else{
      if(targetNode.right === null){
        targetNode.right = newNode;
      }else{
        this.insertNodeHanlder(targetNode.right, newNode);
      }
    }
  }
  // 查找
  findNode(value){
    let node = this.root;
    while(node){
      if(node.data === value){
        return node;
      }else if(node.data >= value){
        node = node.left;
      }else{
        node = node.right;
      }
    }
    return null;
  }
  findNode2(value){
    let node = this.root;
    function find(node){
      if(node.data === value){
        return node;
      }else if(node.data >= value){
        return find(node.left);
      }else{
        return find(node.right);
      }
    }
    return find(node);
  }
}
const tree = new BinaryTree();
tree.insertNode(8);
tree.insertNode(3);
tree.insertNode(10);
tree.insertNode(1);
tree.insertNode(6);
tree.insertNode(14);
tree.insertNode(4);
tree.insertNode(7);
tree.insertNode(13);
tree.insertNode(15);
console.log(tree)

module.exports = tree;

// 实际上是构建了一个二叉查找树，左子树的值小于根节点，右子树的值大于根节点
