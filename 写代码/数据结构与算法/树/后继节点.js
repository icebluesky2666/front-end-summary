// 中序遍历的后继节点
// 一条纸对折n次输出折痕顺序
function getArrayList(n){
  process(1, n, true);
}
function process(current, n, flag){
  if(current > n){
    return;
  }
  process(current+1, n, true);
  console.log(flag?'凹':'凸');
  process(current+1, n, false);
}
getArrayList(3)


