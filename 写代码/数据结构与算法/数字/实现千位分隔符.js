function parseToMoney(num){
  let numFormat = parseFloat(num.toFixed(3));
  let [num1,num2] = String.prototype.split.call(numFormat, '.');
  num1 = num1.replace(/\d(?=(\d{3})+$)/g,'$&,');
  console.log(`${num1}${num2?'.'+num2:''}`)
  return `${num1}.${num2}`
}


// 保留三位小数
parseToMoney(1234.56); // return '1,234.56'
parseToMoney(123456789); // return '123,456,789'
parseToMoney(1087654.321); // return '1,087,654.321'