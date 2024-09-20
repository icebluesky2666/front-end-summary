// var count = 10;
// function a() {
//  return count + 10;
// }
// function b() {
//  var count = 20;
//  return a();
// }
// console.log(b());



// var count = 10;

// function b() {
//  var count = 20;
//  function a() {
//   return count + 10;
//  }
//  return a();
// }
// console.log(b());



var count = 10;

function b() {
 var count = 20;
 var a = () => {
  return count + 10;
 }
 return a();
}
console.log(b());