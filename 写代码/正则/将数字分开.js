// 将输入1234567.1234 变成 1,234,567.12

function formatNum(num){
  //console.log((num + '').replace(/(\d{3})?=./g, ',$1'))
  // return (num + '').replace(/(\d{3})+(?=\.)/g, ',$1');//1,567.1234
  // return (num + '').replace(/(?![\.])(?=(\d{3})+(\.\d+)?$)/g, ',');
  return (num + '').replace( /(?!^)(?=(\d{3})+(\.|$))/g, ',');
  // return Number(num).toLocaleString();
}
console.log(formatNum('1234567.1234'))