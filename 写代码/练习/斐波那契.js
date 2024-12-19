// 1 2 3 5 8
// f(n) = f(n-1) + f(n-2)
// 11235
function getNumber(number){
  let p1 = 1;
  let p2 = 1;
  let num = 2;
  let res = [1,1];
  while(num < number){
    let p3 = p1 + p2;
    res.push(p3);
    p1 = p2;
    p2 = p3;
    num ++;
  }
  return res;
}
console.log(getNumber(10))

function getNumber(num){
  let p1 = 1;
  let p2 = 1;
  const arr = [p1,p2];
  while(num>2){
    let p3 = p1+p2;
    p1=p2;
    p2=p3;
    arr.push(p3);
    num --;
  }
  return arr;
}
