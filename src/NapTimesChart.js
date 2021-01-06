import React from 'react';
import { Container } from 'react-bootstrap';
import './NapTimesChart.scss';
import { VictoryTooltip, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;
//make it so graph updates when component loads

class NapTimesChart extends React.Component {
  componentDidMount(){
    const {setDates, setNapInfo, dates} = this.props;
    axios.post(urlGetData, {user: 'omar'})
    .then(res => {
      console.log(res);
        let newDates = [];
        let newNapInfo = [];
        res.data.map(x => {
          newDates = [...newDates, x.date];
          newNapInfo = [...newNapInfo, {
            date: x.date, 
            napStartTime: x.napStartTime,
            napEndTime: x.napEndTime
          }]
          return null;
        })
        setDates(newDates);
        setNapInfo(newNapInfo);
    })
  }
  render() {
    const {napInfo} = this.props;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (napInfo.length > 1) {
      data = napInfo.filter(napObj => napObj.napStartTime).map((e, i) => {
        const dateTime = new Date(`January 1, 2000 ${e.napStartTime}`);
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        dateLabels = [...dateLabels, dateLabel];
        return(
          { x: date, y0: dateTime, y: dateTimeEnd }
        );
      });
    }
    return (
      <>
        <div className="victory-chart-1-container">
          <h2>Nap Times</h2>
          <VictoryChart
            theme={VictoryTheme.material}
            padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
            scale={{y:'time'}}
            domainPadding={{ x: 20, y: 20 }}
          >
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              // tickValues={[1, 2, 3, 4, 5]}
              tickValues={xAxisTickValues}
              // tickFormat={["1 Jan", "2 Jan", "3 Jan", "Quarter 4"]}
              tickFormat={dateLabels}
              />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
              // tickFormat specifies how ticks should be displayed
              // tickFormat={(y) => {
              //   return(
              //     `${y-y%1}:${Math.round(y%1*10)/10*60}PM`
              //   );
              // }}
            />
            <VictoryBar
              data={data}
              cornerRadius={{topLeft: 3, topRight: 3, bottomLeft: 3, bottomRight: 3}}
              style={{ data: {fill: '#964c9d'} }}
              labels={({ datum }) => {
                return(duration(new Date(datum._y0), new Date(datum._y)))}
              }
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ stroke: "tomato", strokeWidth: 2 }}
                  // centerOffset={{ y: 45 }}
                />
              }
            />
          </VictoryChart>
        </div>
      </>
    )
  }
}

export default NapTimesChart; 

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
                
function duration(start, end) {
  var h1 = start.getHours();
  var m1 = start.getMinutes();
  var h2 = end.getHours();
  var m2 = end.getMinutes();
  var time = (h2 + m2/60) - (h1 + m1/60);
  var timeHours = time - time%1;
  var timeMinutes = Math.round(time%1 * 60);
  return(`${timeHours}h, ${timeMinutes}m`)
}

NapTimesChart.propTypes = {
  dates: PropTypes.array
}