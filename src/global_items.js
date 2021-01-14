import {VictoryScatter, VictoryTooltip} from 'victory';
const url = 'http://localhost:4000/sleep/api/';
/*
const url = 'https://omarshishani.com/sleep/api/';
*/

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const createData1 = (chartInfo, range, chart, showYesterdaysDate, barGraph) => {
  return(
    chartInfo.filter((dataObj, i) => (i < range && dataObj[chart]) || (i < range && dataObj[chart] === 0)).map((e, i, arr) => {
      const dateTime = new Date(`January 1, 2000 ${e[chart]}`);
      let date;
      let dateLabelPrimer;
      if (showYesterdaysDate) {
        date = yesterdaysDate(e.date);
        dateLabelPrimer = yesterdaysDateLabelPrimer(e.date);
      } else {
        date = Math.floor(Date.parse(e.date)/1000/86400);
        dateLabelPrimer = new Date(Date.parse(e.date));
      }
      if (chart === 'sleepAidItem'){
        const sleepAidItem = e.sleepAidItem.match(/(?<=\s+)[A-Za-z]+/g)[0];
        const sleepAidMg = e.sleepAidItem.match(/\d+/g);
        return(
          { x: date, y: sleepAidMg, dateLabel: getLongDate(dateLabelPrimer), sleepAidItem: sleepAidItem}
        );
      } else if (chart === 'arousalDuration'){
        const durations = e.arousalDuration.match(/\d+/g).map(x => Number(x));
        let durationData = [];
        for (let i = 0; i < durations.length; i++) {
          durationData = [...durationData, 
            { x: date, y: durations[i], dateLabel: getLongDate(dateLabelPrimer)}
          ];
        }
        return(durationData);  
      } else if (chart === 'napStartTime'){
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
        return(
          { x: date, y0: dateTime, y: dateTimeEnd, dateLabel: getLongDate(dateLabelPrimer), barWidthDate: date}
        );
      } else if (barGraph){
        return { x: date, y: e[chart], dateLabel: getLongDate(dateLabelPrimer), timeLabel: `${e[chart]} min` }
      } else {
        return { x: date, y: dateTime, dateLabel: getLongDate(dateLabelPrimer), timeLabel: formatAMPM(dateTime) }
      }
    })
  ) 
}
const createXAxisTickValues = (chartInfo, range, chart, showYesterdaysDate) => {
  let xAxisTickValues = [];
  chartInfo.filter((dataObj, i) => i < range && dataObj[chart]).forEach((e, i, arr) => {
    let date;
    if (showYesterdaysDate) {
      date = yesterdaysDate(e.date);
    } else {
      date = Math.floor(Date.parse(e.date)/1000/86400);
    }
    xAxisTickValues = [...xAxisTickValues, date];
  })
  return xAxisTickValues;
}
const createDateLabels = (chartInfo, range, chart, showYesterdaysDate) => {
  let dateLabels = [];
  chartInfo.filter((dataObj, i) => i < range && dataObj[chart]).forEach((e, i, arr) => {
    let dateLabelPrimer;
    
    if (showYesterdaysDate) {
      dateLabelPrimer = yesterdaysDateLabelPrimer(e.date);
    } else {
      dateLabelPrimer = new Date(Date.parse(e.date));
    }


    const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
    dateLabels = [...dateLabels, dateLabel];
  })
  return dateLabels;
}

const yesterdaysDateLabelPrimer = (date) => {
  return new Date(Date.parse(date) - 1000*86400);
}
const yesterdaysDate = (date) => {
  return Math.floor(Date.parse(date)/1000/86400) - 1;
};

const flyoutStyleNight = (nightMode) => (
  { 
    stroke: nightMode ? "#00ff2b" : "tomato", 
    fill: nightMode ? 'black' : '#fff5eb',
    strokeWidth: 2 
  }
)

const getLongDate = (date) => {
  var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const longDateLabel = `${weekday[date.getDay()]}, ${month[date.getMonth()]} ${date.getDate()}`;
  return longDateLabel;
}
// exitBedCharts sleepQualityCharts  
const victoryTooltipLabelStyle = (nightMode) => (
  { 
    labels: {fill: nightMode ? 'white' : 'black'}
  }
);

const victoryLineStyle = (nightMode, chartGroup) => (nightMode ? 
  {data: {
    stroke: 
      chartGroup === 'enterBedCharts' ? '#00ffcb'
      : chartGroup === 'exitBedCharts' ? 'rgb(216 255 0)'
      : null
      ,
    transition: `stroke ${nightModeTransitionTime}`
  }}
  : 
  {data: {
    stroke: 
      chartGroup === 'enterBedCharts' ? '#06790f'
      : chartGroup === 'exitBedCharts' ? 'rgb(164 0 0)'
      : null
      ,
    transition: `stroke ${nightModeTransitionTime}`
  }}
);

const VictoryScatterLineComplement = (data, nightMode, chartGroup) =>
<VictoryScatter
  style={
    { 
      data: 
        { fill: 
          chartGroup === 'enterBedCharts' ? 
            nightMode ? "red" : "tomato" 
          :
          chartGroup === 'exitBedCharts' ?   
            nightMode ? "rgb(0, 255, 43)" : "#00c95a"
          : 
          nightMode ? "rgb(0, 255, 43)" : "#00c95a", 
        }, 
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
        stroke: 
          chartGroup === 'enterBedCharts' ? 
            nightMode ? "#00ff2b" : "tomato" 
          :
          chartGroup === 'exitBedCharts' ?   
            nightMode ? "rgb(0 255 161)" : "tomato"
          : 
          nightMode ? "#00ff2b" : "tomato",
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

export {c, getClickedDate, url, varToString, nightModeTransitionTime, victoryAxisStyle, VictoryScatterLineComplement, getLongDate, victoryLineStyle, flyoutStyleNight, victoryTooltipLabelStyle, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createDateLabels, createXAxisTickValues};

export default url;