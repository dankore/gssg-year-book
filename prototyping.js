
// let input = [-2, 2, 5, -11, 6];
// function maxSumTwo(array) {
//   let max_sum = array[0];
//   let current_sum = max_sum;
//   for (let i = 1; i < array.length; i++) {
//     current_sum = Math.max(array[i] + current_sum, array[i]);
//     max_sum = Math.max(current_sum, max_sum);
//   }
//   return max_sum
// }
// let data = ['a', 'b']

// console.log(data.slice(0,1));
// console.log(data.slice(1).length);
// console.log("Liked by " + data.slice(0,1) + " and " + data.slice(1).length + " others.");

const isPalin = string => {
  let newString = "";
  for (let i = string.length - 1; i >= 0; i--) {
    const element = string[i];
    newString += element;
  }
  return newString === string;
};

const substrings = s => {
  let subS = [];
  s == "" ? undefined : "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i+1; j < s.length; j++) {
      let cur = s.slice(i, j);
      let lastLen = subS[subS.length - 1] ? subS[subS.length - 1].length : 0;
      console.log(cur.length, lastLen)
      if (isPalin(cur) && !subS.includes(cur) && cur.length >= lastLen)
        subS.push(cur);
    }
  }
  return subS[subS.length-1];
}


console.log(substrings(""));



// console.log(isPalin("labal"))