const sleepAidItem = '23m, 22, 5   minutes '

const sleep = sleepAidItem.match(/(?<=\s+)[A-Za-z]+/g);

console.log(sleep)