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

// 输出

function printNode(node){
  while(node){
    console.log(node.value, '=>', node.next?node.next.value: 'null');
    node = node.next;
  }
}

// printNode(a);
// 反转单向链表
function converseNodes(node){
  let preNode = null;
  let currentNode = node;
  let nextNode = node.next;
  let Head = null;
  while(currentNode){
    nextNode = currentNode.next;
    currentNode.next = preNode;
    preNode = currentNode;
    Head = currentNode;
    currentNode = nextNode;
  }
  return Head;
}
console.log('反转单向链表:---------')
printNode(converseNodes(a))


// 打印两个有序链表公共部分
// 1=>2=>3=>4     0=>3=>4=>8
let q = new nodeA(4); q.next = null;
let w = new nodeA(3); w.next = q;
let ef = new nodeA(2); ef.next = w;
let r = new nodeA(1); r.next = ef;

let qq = new nodeA(8); qq.next = null;
let ww = new nodeA(4); ww.next = qq;
let ee = new nodeA(3); ee.next = ww;
let ee1 = new nodeA(3); ee1.next = ee;
let rr = new nodeA(0); rr.next = ee1;

function findCommon(head1, head2){
  let node1 = head1;
  let node2 = head2;
  while(node1 && node2){
    if(node1.value !== node2.value){
      if(node1.value < node2.value){
        node1 = node1.next;
      }else{
        node2 = node2.next;
      }
    }else{
      console.log(node1.value);
      node1 = node1.next;
      node2 = node2.next;
    }
  }
}
console.log('有序链表公共部分:---------')
findCommon(r, rr)

// // 单链表判断是否回文，时间复杂度O（n），空间复杂度O（1）
let ttt = new nodeA(0); ttt.next = null;
let qqq = new nodeA(1); qqq.next = ttt;
let www = new nodeA(2); www.next = qqq;
let eee = new nodeA(1); eee.next = www;
let rrr = new nodeA(0); rrr.next = eee;
//思路一，反转便利比较
//思路二，便利将节点值压栈，再便利一次比较

// function huiwen1(head){
//   const arr = [];
//   let node = head;
//   let flag = true;
//   while(node){
//     arr.unshift(node.value);
//     node = node.next;
//   }
//   node = head;
//   let i = 0;
//   while(node){
//     if(node.value !== arr[i++]){
//       flag = false;
//     }
//     node = node.next;
//   }
//   return flag;
// }
// console.log('判断回文方法一：-------')
// console.log(huiwen1(rrr))

// // 1 2 3 4 5 4 3 2 1   1221
// function huiwen2(head){
//   let p1 = head;
//   let p2 = head;
//   let head1 = head;
//   let head2 = null;
//   let res = true;
//   while(p2){
//     p1 = p1.next;
//     p2 = p2.next?p2.next.next: p2.next;
//   }
//   console.log('中点：', p1.value)
//   // p1 中点

//   let next = null;
//   let pre = null;
//   while(p1){
//     next = p1.next;
//     p1.next = pre;
//     pre = p1;
//     if(!next){
//       head2 = p1;
//       break;
//     }
//     p1 = next;

//   }
//   console.log('第二个头：', head2)
//   // 逐个比较
//   while(head1 && head2){
//     if(head1.value !== head2.value){
//       res = false;
//       break;
//     }
//     head1 = head1.next;
//     head2 = head2.next;
//   }
//   return res;
// }
// // console.log('判断回文方法二：-------')
// // console.log(huiwen2(rrr))

// // 给一个单链表和一个数字，要求大于数字的放在单链表右侧，等于的放中间，小于的放左侧
// function sortNodes(head, num){
//   let small_start = null;
//   let small_end = null;
//   let equel_start = null;
//   let equel_end = null;
//   let big_start = null;
//   let big_end = null;
//   while(head){
//     let next = head.next;
//     head.next = null;
//     if(head.value < num){
//       if(!small_start){
//         small_start = head;
//         small_end = head;
//       }else{
//         small_end.next = head;
//         small_end = head;
//       }
//     }
//     if(head.value == num){
//       if(!equel_start){
//         equel_start = head;
//         equel_end = head;
//       }else{
//         equel_end.next = head;
//         equel_end = head;
//       }
//     }
//     if(head.value > num){
//       if(!big_start){
//         big_start = head;
//         big_end = head;
//       }else{
//         big_end.next = head;
//         big_end = head;
//       }
//     }
//     head = next;
//   }
//   // 拼接
//   if(small_end){
//     small_end.next = equel_start;
//     equel_end = equel_end == null?small_end:equel_end;
//   }
//   if(equel_end){
//     equel_end.next = big_start;
//   }
//   return small_start?small_start:(equel_start?equel_start:big_start);
// }
// // console.log('单链表左中右分割1：--------')
// // printNode(sortNodes(rrr, 1))

// function sortNodes2(head, num){
//   let res = head;
//   let arr = [];
//   while(res){
//     arr.push(res.value);
//     res = res.next;
//   }
//   let left = 0;
//   let right = arr.length - 1;
//   let flag = 0;
//   while(flag < right){
//     if(arr[flag]< num){
//       exchange(arr, left++, flag++);
//     }
//     if(arr[flag] > num){
//       exchange(arr, flag, right--);
//     }
//     if(arr[flag] === num){
//       flag++;
//     }
//   }
//   console.log(arr);
//   let node = head;
//   while(node){
//     node.value = arr.shift();
//     node = node.next;
//   }
//   return head;
// }
// // console.log('单链表左中右分割2：--------')
// // printNode(sortNodes2(rrr, 1))
// function exchange(arr, a,b){
//   arr[a] = arr[a] ^ arr[b];
//   arr[b] = arr[a] ^ arr[b];
//   arr[a] = arr[a] ^ arr[b];
// }
// // 一个单链表，节点有一个randor指向任何一个链表中的节点，要求克隆当前单链表
// 思路一： 首先便利老链表，过程中创建新链表，并且将老链表节点映射新链表节点的关系保存在Map里面，再次进行randem的绑定
// function nodeB(value){
//   this.value = value;
//   this.next = null;
//   this.random = null;
// }

// let e1 = new nodeA('E'); e1.next = null;
// let d1 = new nodeA('D'); d1.next = e1;
// let c1 = new nodeA('C'); c1.next = d1;
// let b1 = new nodeA('B'); b1.next = c1;
// let a1 = new nodeA('A'); a1.next = b1;
// a1.random = d1;
// b1.random = c1;

// function copyNodesInMap(head){
//   let nodeMap = new Map();
//   let p1 = head;
//   let pre = null;
//   let head1 = null;
//   while(p1){
//     let node = new nodeA(p1.value);
//     nodeMap.set(p1, node)
//     if(pre){
//       pre.next = node;
//     }else{
//       head1 = node;
//     }
//     pre = node;
//     p1 = p1.next;
//   }
//   // head1新链表
//   p1 = head;
//   p2 = head1;
//   while(p1 && p2){
//     p2.random = nodeMap.get(p1.random) || null;
//     p1 = p1.next;
//     p2 = p2.next;
//   }
//   return head1
// }
// // copyNodesInMap(a1);
// function copyNodesInMap2(head){
//   let p1 = head;
//   while(p1){
//     let node = new nodeA(p1.value);
//     let next = p1.next;
//     p1.next = node;
//     node.next = next;
//     p1 = p1.next.next;
//   }
//   p1 = head;
//   while(p1){
//     p1.next.random = p1.random?p1.random.next: null;
//     if(!p1.next) break;
//     p1 = p1.next.next;
//   }
//   // 分开
//   p1 = head;
//   let res = p1.next;;
//   while(p1){
//     let k1 = p1.next;
//     p1.next = p1.next.next;
//     k1.next = k1.next?k1.next.next:k1.next
//     p1 = p1.next;
//   }
//   return res;
// }
// copyNodesInMap2(a1);