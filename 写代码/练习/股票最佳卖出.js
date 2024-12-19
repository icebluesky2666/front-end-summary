var maxProfit = function(prices) {
  // 享受每一个上升周期是最高的
  let s1 = false;// false待买入
  let p1 = 0;// 买入价
  let p2 = 0;//总收益
  for(let i = 0;i<prices.length;i++){
      if(!s1){
          if((prices[i+1] > prices[i] && ((prices[i] <= prices[i-1]) || i === 0))){
              console.log('买：', prices[i])
              p1 = prices[i];
              s1 = true;
          }
      }else{
          if(prices[i+1] <= prices[i] || i === prices.length - 1){
              console.log('卖：', prices[i])
              p2 = p2 + prices[i] - p1;
              s1 = false;
          }
      }
      return p2
  }
};
maxProfit([7,1,5,3,6,4])