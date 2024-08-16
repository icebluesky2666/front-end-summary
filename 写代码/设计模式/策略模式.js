// 根据不同的参数，获取不同的策略方法
const strategy = {
  newPrice: (price) => {
    return price * 1;
  },
  oldPrice: (price) => {
    return price * 0.8;
  },
  Price: (price) => {
    return price * 0.5;
  },
}
function getPrice(type, price){
  return strategy[type](price);
}
// 使用
console.log(getPrice('newPrice', 100))
console.log(getPrice('oldPrice', 100))
console.log(getPrice('Price', 100))
