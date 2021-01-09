const str = '23m, 22, 5 minutes'
const match = str.match(/\d+/g).map(x => Number(x));
console.log(match)
const x = match.map(x => Number(x))
console.log(x);
