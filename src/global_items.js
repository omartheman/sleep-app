import {VictoryScatter, VictoryTooltip} from 'victory';
const url = 'http://localhost:4000/sleep/api/';
/*
const url = 'https://omarshishani.com/sleep/api/';
*/

const victoryScatterLabels = (datum) => {
  if (datum){
    return(
      `${datum.y}\n${datum.dateLabel}`
    );
  }
}

const VictoryScatterLineComplement = (data, nightMode) =>
<VictoryScatter
  style={
    { 
      data: { fill: "#c43a31" }, 
      labels: {fill: nightMode ? 'white' : 'black'}
    }
  }
  size={4}
  data={data}
  labels={({ datum }) => {
    if (datum){
      return(
        `${datum.timeLabel}\n${datum.dateLabel}`
      );
    }
  }}
  labelComponent={
    <VictoryTooltip
      flyoutStyle={{ 
        stroke: nightMode ? "#00ff2b" : "tomato", 
        fill: nightMode ? 'black' : '#fff5eb',
        strokeWidth: 2 
      }}
    />
  }
/>;

const lightGrey = 'rgb(236, 239, 241)';
const darkGrey = '#212529';
const victoryAxisStyle = (axis, nightMode) => (nightMode ? 
  {
    tickLabels: {
      fill: 'white',
      transition: `fill ${nightModeTransitionTime}`
    }, 
    grid: {
        stroke: axis === 'y' ? lightGrey : darkGrey, 
        strokeDasharray: '7',
        transition: `stroke ${nightModeTransitionTime}`
    }
  }
  : 
  {
    grid: {
      stroke: axis === 'y' ? darkGrey : lightGrey, 
      strokeDasharray: '7',
      transition: `stroke ${nightModeTransitionTime}`
    }
  }
)

const nightModeTransitionTime = '0.5s';

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

export {c, getClickedDate, url, varToString, nightModeTransitionTime, victoryAxisStyle, VictoryScatterLineComplement};

export default url;