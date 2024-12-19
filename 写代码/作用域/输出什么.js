// var count = 10;
// function a() {
//  return count + 10;
// }
// function b() {
//  var count = 20;
//  return a();
// }
// console.log(b());
// 20 需要看定义的作用域外面



// var count = 10;

// function b() {
//  var count = 20;
//  function a() {
//   return count + 10;
//  }
//  return a();
// }
// console.log(b());
// 30



var count = 10;
var a = null;
function b() {
 var count = 20;
 a = () => {
  return count + 10;
 }
 return a();
}
console.log(b());