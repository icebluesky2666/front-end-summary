function deleteNode (head, node) {
  let currentNode = head;
  let lastNode = null;
  while(currentNode){
    if(currentNode.value === node.value){
      lastNode.next = currentNode.next;
      currentNode.next = null;
    }
    lastNode = currentNode;
    currentNode = currentNode.next;
  }
}