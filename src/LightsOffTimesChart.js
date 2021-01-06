import React from 'react';
import { Container } from 'react-bootstrap';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class LightsOffTimesChart extends React.Component {
  state = {
    dates: [],
    chartInfo: []
  }
  componentDidMount(){
    const {dates} = this.state;
    axios.post(urlGetData, {user: 'omar'})
    .then(res => {
      console.log(res);
      if (dates.length === 0){
        let newDates = [];
        let newChartInfo = [];
        res.data.map(x => {
          newDates = [...newDates, x.date];
          newChartInfo = [...newChartInfo, {
            date: x.date,
            lightsOffTime: x.lightsOffTime
          }];
          return null;
        })
        this.setState({chartInfo: newChartInfo});
        this.setState({dates: newDates});
      } 
    })
  }
  render() {
    const {dates, chartInfo} = this.state;
    const dateLabels = dates.filter(x => x).map((x, i) => {
      const date = new Date(Date.parse(x));
      return(
        `${date.getMonth()+1}/${date.getDate()}`
      )
    });
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      data = chartInfo.filter(napObj => napObj.lightsOffTime).map((e, i) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const dateTime = new Date(`January 1, 2000 ${e.lightsOffTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        return(
          { x: date, y: dateTime }
        );
      });
    }
    return (
      <>
        <div className="victory-chart-1-container">
          <h2>Time Lights Turned Off</h2>
          <VictoryChart
            theme={VictoryTheme.material}
            padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
            scale={{y:'time'}}
            domainPadding={{ x: 20, y: 20 }}
          >
            <VictoryAxis
              tickValues={xAxisTickValues}
              tickFormat={dateLabels}
              />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
            />
            <VictoryLine
              data={data}
            />
          </VictoryChart>
        </div>
      </>
    )
  }
}

export default LightsOffTimesChart; 

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

LightsOffTimesChart.propTypes = {
  dates: PropTypes.array
}