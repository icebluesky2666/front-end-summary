// 创建单项链表

function nodeA(value){
  this.value = value;
  this.next = null;
}
// ================= ||
// let e = new nodeA('E'); e.next = null;
// let d = new nodeA('D'); d.next = e;
// let c = new nodeA('C'); c.next = d;
// let b = new nodeA('B'); b.next = c;
// let a = new nodeA('A'); a.next = b;


// let e1 = new nodeA('E'); e1.next = null;
// let d1 = new nodeA('D'); d1.next = e1;
// let c1 = new nodeA('C'); c1.next = d1;
// let b1 = new nodeA('B'); b1.next = c1;
// let a1 = new nodeA('A'); a1.next = b1;

// ================= 66
// let e = new nodeA('E'); 
// let d = new nodeA('D'); d.next = e;
// let c = new nodeA('C'); c.next = d;
// let b = new nodeA('B'); b.next = c;
// let a = new nodeA('A'); a.next = b;
// e.next = c;


// let e1 = new nodeA('E'); 
// let d1 = new nodeA('D'); d1.next = e1;
// let c1 = new nodeA('C'); c1.next = d1;
// let b1 = new nodeA('B'); b1.next = c1;
// let a1 = new nodeA('A'); a1.next = b1;
// e1.next = c1;

// ================= |6
// let e = new nodeA('E'); e.next = null;
// let d = new nodeA('D'); d.next = e;
// let c = new nodeA('C'); c.next = d;
// let b = new nodeA('B'); b.next = c;
// let a = new nodeA('A'); a.next = b;

// let e1 = new nodeA('E'); 
// let d1 = new nodeA('D'); d1.next = e1;
// let c1 = new nodeA('C'); c1.next = d1;
// let b1 = new nodeA('B'); b1.next = c1;
// let a1 = new nodeA('A'); a1.next = b1;
// e1.next = c1;

// ================= Y
// let e = new nodeA('E'); e.next = null;
// let d = new nodeA('D'); d.next = e;
// let c = new nodeA('C'); c.next = d;
// let b = new nodeA('B'); b.next = c;
// let a = new nodeA('A'); a.next = b;


// let b1 = new nodeA('B'); b1.next = c;
// let a1 = new nodeA('A'); a1.next = b1;

// ================= 66
let e = new nodeA('E'); 
let d = new nodeA('D'); d.next = e;
let c = new nodeA('C'); c.next = d;
let b = new nodeA('B'); b.next = c;
let a = new nodeA('A'); a.next = b;
e.next = b;

let b1 = new nodeA('B'); b1.next = b;
let a1 = new nodeA('A'); a1.next = b1;


// 给定两个可能有环的单链表，可能相交也可能不相交，相交返回第一个节点不相交返回null
// Y     ｜｜    -O-    66  ｜6
// 方法一：用map的方式解
// 判断是否有环,有环返回节点无环返回false
function hasRepeat(head){
  let slow = head;
  let fast = head;
  let flag = false;
  while(fast && fast.next){
    slow = slow.next;
    fast = fast.next.next;
    if(slow === fast){
      flag = true;
      break;
    }
  }
  if(flag){
    // 有环
    slow = head;
    while(slow !== fast){
      slow = slow.next;
      fast = fast.next;
    }
    flag = slow;
  }
  return flag;
}
// 处理五种情况
function getCommonNode(head1, head2){
  let falg1 = hasRepeat(head1);
  let flag2 = hasRepeat(head2);
  let node1 = head1;
  let node2 = head2;
  let resNode = null;
  if(!falg1 && !flag2){// Y
    let num1 = 0;
    let num2 = 0;
    while(node1){
      num1++;
      node1 = node1.next;
    }
    while(node2){
      num2++;
      node2 = node2.next;
    }
    let longest = num1>num2? head1: head2;
    let short =  num1>num2? head2: head1;
    let num3 = Math.abs(num1-num2);
    while(num3){
      longest = longest.next;
      num3--;
    }
    
    while(longest){
      if(longest === short){
        resNode = longest;
        break;
      }
      longest = longest.next;
      short = short.next;
    }
  }else if(falg1 && flag2){// -O-
    node1 = head1;
    node2 = head2;
    // 找到其中一个交点直接用map
    while(node1){
      node1 = node1.next;
      if(node1 === falg1){
        node1 = node1.next;
        break;
      }
    }
    while(node1 !== falg1){
      node1 = node1.next;
      if(node1 === flag2){
        resNode = flag2;
      }
    }
  }else{
    resNode = null;
  }
  return resNode;
}


console.log(getCommonNode(a,a1))