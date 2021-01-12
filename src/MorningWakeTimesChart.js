import React from 'react';
import { Container } from 'react-bootstrap';
import './MorningWakeTimesChart.scss';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class MorningWakeTimesChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    axios.post(urlGetData, {user: this.props.loggedInUser})
    .then(res => {
      console.log(res);
      let newChartInfo = [];
      res.data.map(x => {
        newChartInfo = [...newChartInfo, {
          date: x.date,
          morningWakeTime: x.morningWakeTime
        }];
        return null;
      })
      this.setState({chartInfo: newChartInfo});
    })
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser){
      axios.post(urlGetData, {user: this.props.loggedInUser})
      .then(res => {
        console.log(res);
        let newChartInfo = [];
        res.data.map(x => {
          newChartInfo = [...newChartInfo, {
            date: x.date,
            morningWakeTime: x.morningWakeTime
          }];
          return null;
        })
        this.setState({chartInfo: newChartInfo});
      })
    }
  }
  render() {
    const {chartInfo} = this.state;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      data = chartInfo.filter(napObj => napObj.morningWakeTime).map((e, i) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const dateTime = new Date(`January 1, 2000 ${e.morningWakeTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        dateLabels = [...dateLabels, dateLabel];
        return(
          { x: date, y: dateTime }
        );
      });
    }
    return (
      <>
        <div className="victory-chart-1-container">
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
          <h2>Wake Up Times</h2>
        </div>
      </>
    )
  }
}

export default MorningWakeTimesChart; 

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

MorningWakeTimesChart.propTypes = {
  dates: PropTypes.array
}