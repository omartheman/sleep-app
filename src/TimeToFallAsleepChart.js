import React from 'react';
import { Container } from 'react-bootstrap';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class TimeToFallAsleepChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    axios.post(urlGetData, {user: 'omar'})
    .then(res => {
      console.log(res);
      let newChartInfo = [];
      res.data.map(x => {
        newChartInfo = [...newChartInfo, {
          date: x.date,
          timeToFallAsleep: x.timeToFallAsleep
        }];
        return null;
      })
      this.setState({chartInfo: newChartInfo});
    })
  }
  render() {
    const {chartInfo} = this.state;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      c('chartinfo timetosleep', chartInfo)
      data = chartInfo.filter(napObj => napObj.timeToFallAsleep).map((e, i) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        dateLabels = [...dateLabels, dateLabel];
        return(
          { x: date, y: e.timeToFallAsleep }
        );
      });
      // dateLabels = e.date.filter(x => x).map((x, i) => {
      //   c('datelabels tosleep', date)
      //   return(
      //     `${date.getMonth()+1}/${date.getDate()}`
      //   )
      // });
      c('data in timetosleep', data)
    }
    return (
      <>
          <div className="victory-chart-1-container">
            <h2>How Long To Fall Asleep</h2>
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
              scale={{y:'number'}}
              domainPadding={{ x: 20, y: 20 }}
            >
              <VictoryAxis
                tickValues={xAxisTickValues}
                tickFormat={dateLabels}
                />
              <VictoryAxis
                style={{grid:{stroke:'black', strokeDasharray: '7'}}}
                dependentAxis
                tickFormat={(y) => `${y} min` }
              />
              <VictoryBar
                data={data}
              />
            </VictoryChart>
          </div>
      </>
    )
  }
}

export default TimeToFallAsleepChart; 

TimeToFallAsleepChart.propTypes = {
  dates: PropTypes.array
}