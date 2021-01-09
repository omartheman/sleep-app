const url = 'http://localhost:4000/sleep/api/';
/*
const url = 'https://omarshishani.com/sleep/api/';
*/

function c (msg, input) {return(console.log(`${msg}: `, input))};

function getClickedDate(date, type){
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  
  var month = [];
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  
  return type === 'mysql' ? `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  : `${weekday[date.getDay()]}, ${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const varToString = varObj => Object.keys(varObj)[0]; 

export {c, getClickedDate, url, varToString};

export default url;