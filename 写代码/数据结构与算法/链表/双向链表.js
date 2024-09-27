// 创建单项链表

function nodeA(value){
  this.value = value;
  this.next = null;
}

let e = new nodeA('E'); e.next = null;
let d = new nodeA('D'); d.next = e;
let c = new nodeA('C'); c.next = d;
let b = new nodeA('B'); b.next = c;
let a = new nodeA('A'); a.next = b;
e.prev = d;
d.prev = c;
c.prev = b;
b.prev = a;
a.prev = null;

// 反转
function converseNode(head){
  let p1 = null;
  let p2 = head;
  let p3 = null;
  let tail = null;
  while(p2){
    p3 = p2.next;
    p2.next = p1;
    p2.prev = p3;
    p1 = p2;
    p2 = p3;
    if(!p3){
      tail = p2;
      break
    }
    return [head, tail]
  }
}