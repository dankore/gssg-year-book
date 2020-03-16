function twoSum(array, target){
  let map = new Map();

  for (let i = 0; i < array.length; i++) {
    if(map.has(array[i])){
      return [map.get(array[i]), i]
    }
    map.set(target - array[i], i)
  }
}


console.log(twoSum([4, 7, 8, 5, 8, 9, 1], 5))



// function twoSum(array, target) {
//   console.log(array, target);
//   let sum = [];

//   for (let i = 0; i < array.length; i++) {
//     for (let j = i + 1; j < array.length; j++) {
//       if (array[i] + array[j] == target) sum.push(i, j);
//     }
//   }
//   return sum;
// }
