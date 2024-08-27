function myAjax(url){
  return new Promise((resolve, rejetct)=>{
    let xhr = new XMLHttpRequest();
    xhr.open(url);
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState == 4){
        if(xhr.status >= 200 && xhr.status<=300){
          resolve(xhr.responseText)
        }else{
          rejetct('出错')
        }
      }
    }
    xhr.send();
  })
}
myAjax('http://sada').then(()=>{
  
})