Array.prototype.mySome = function(callback, context){
  let flag = false;
  let len = this.length;
  for(let i=0;i<len;i++){
    if(callback.apply(context,[this[i],i,this])){
      flag = true;
      break;
    }
  }
  return flag;
}

let a = [1,2,3];
let res = a.mySome((x)=>{
 return x>2;
})
console.log(res)