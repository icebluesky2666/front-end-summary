function ax(gas, cost){
  let sum = 0, max_g = 0, ans = 0;
  for (let i = gas.length - 1; i >= 0; i--){
      sum += gas[i] - cost[i];
      max_g = Math.max(sum, max_g);
      console.log(`sum=${sum},max=${max_g}`)
      if (sum >= max_g) ans = i;
  }
  return sum >= 0 ? ans : -1;
}
let gas = [1,2,3,4,4];
let cost = [3,4,5,1,2];
console.log(ax(gas,cost))