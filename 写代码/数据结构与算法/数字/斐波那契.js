// 1 2 3 5 8
// f(n) = f(n-1) + f(n-2)

function *getNumber(number){
  let i = 0;
  let oldNumberOne = 0;
  let oldNumberTwo = 0;
  while(i < number){
    if(!oldNumberTwo) {
      yield 1;
      oldNumberTwo = 1;
      // console.log(oldNumberTwo)
      i++;
      continue;
    }
    if(!oldNumberOne) {
      yield 2;
      oldNumberOne = 2;
      // console.log(oldNumberOne)
      i++;
      continue;
    }
    
    let data = (oldNumberOne + oldNumberTwo);
    yield data
    // console.log(data);
    oldNumberTwo = oldNumberOne;
    oldNumberOne = data;
    i++;
  }
}
let generater = getNumber(100);
for(let i of generater){
  console.log(i)
}