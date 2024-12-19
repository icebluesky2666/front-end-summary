/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  // let preLen = matrix[0].length;
  // let res = [];
  // for(let i=0;i<matrix.length;i++){
  //     for(j=0;j<matrix[0].length;j++){
  //         if(res[j]){
  //             res[j].push(matrix[i][j])
  //         }else{
  //             res[j] = [matrix[i][j]]
  //         }
          
  //     }
  // }
  // matrix.length = 0;
  // for(let i=0;i<res.length;i++){
  //     for(j=0;j<res[0].length;j++){
  //         if(!matrix[i]){
  //             matrix[i] = [];
  //         }
  //         matrix[i][res[0].length - j -1] = res[i][j]
  //     }
  // }
  // console.log('--', matrix)

  // matrix[i][j]原索引位置→matrix[j][n-1-i]→旋转后索引位置

  // matrix[i][j]←matrix[n-1-j][i]←matrix[n-1-i][n-1-j]←matrix[j][n-1-i]←tmp
  let n = matrix.length;
  let jmax = n/2;
  let imax = (n%2===1)?(n/2+1):(n/2);
  for(let i=0;i<imax;i++){
      for(let j=0;j<jmax;j++){
          console.log('-------修改：', [i,j], ': ', matrix[i][j]);
          exchange(i,j);
      }
  }
  function exchange(i,j){
      let n = matrix.length - 1;
      // 左下角到左上角
      matrix[i][j] = matrix[n-1-j][i];
      console.log(`移动：${[n-1-j][i]}：${matrix[n-1-j][i]} => 到 ${[i][j]}：${matrix[i][j]}`);
      matrix[n-1-j][i] = matrix[n-1-i][n-1-j];
      console.log(`移动：${[n-1-i][n-1-j]}：${matrix[n-1-i][n-1-j]} => 到 ${[n-1-j][i]}：${matrix[n-1-j][i]}`);
      matrix[n-1-i][n-1-j] = matrix[j][n-1-i];
      console.log(`移动：${[j][n-1-i]}：${matrix[j][n-1-i]} => 到 ${[n-1-i][n-1-j]}：${matrix[n-1-i][n-1-j]}`);
      matrix[j][n-1-i] = tmp;
      console.log(`移动：${[i][j]}：${matrix[i][j]} => 到 ${[j][n-1-i]}：${matrix[j][n-1-i]}`);
  }
};