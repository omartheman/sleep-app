import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle} from './global_items';

const urlGetData = `${url}get-data`;

class MinutesEarlyWokeChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    axios.post(urlGetData, {user: this.props.loggedInUser})
    .then(res => {
      let newChartInfo = [];
      res.data.map(x => {
        newChartInfo = [...newChartInfo, {
          date: x.date,
          minutesEarlyWoke: x.minutesEarlyWoke
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
        let newChartInfo = [];
        res.data.map(x => {
          newChartInfo = [...newChartInfo, {
            date: x.date,
            minutesEarlyWoke: x.minutesEarlyWoke
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
      data = chartInfo.filter(napObj => napObj.minutesEarlyWoke || napObj.minutesEarlyWoke === 0).map((e, i, arr) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        const firstDate = Math.floor(Date.parse(arr[0].date)/1000/86400);
        const lastDate = Math.floor(Date.parse(arr[arr.length - 1].date)/1000/86400);
        const dateDiff = lastDate - firstDate;
        if (dateDiff < 15) {
          dateLabels = [...dateLabels, dateLabel];
        } else {
          if (date % 2 === 0){
            dateLabels = [...dateLabels, null]
          } else {
            dateLabels = [...dateLabels, dateLabel];
          }
        }
        return(
          { x: date, y: e.minutesEarlyWoke, dateLabel: dateLabel}
        );
      });
    }
    return (
      <>
          <div className="victory-chart-1-container">
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
              scale={{y:'number'}}
              domainPadding={{ x: 20, y: 20 }}
              
            >
              <VictoryAxis
                tickValues={xAxisTickValues}
                tickFormat={dateLabels}
                tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
                style={victoryAxisStyle('x', this.props.nightMode)}
              />
              <VictoryAxis
                style={{grid:{stroke:'black', strokeDasharray: '7'}}}
                dependentAxis
                tickFormat={(y) => `${y} min` }
                style={victoryAxisStyle('y', this.props.nightMode)}
              />
              <VictoryBar
                data={data}
                barWidth={() => {
                  let firstDate;
                  let lastDate;
                  let dateDiff;
                  if (data) {
                    firstDate = data[0].x; 
                    lastDate = data[data.length - 1].x; 
                    dateDiff = lastDate - firstDate;
                  }
                  return(
                    dateDiff < 10 ? 18
                    : dateDiff < 20 ? 8
                    : 4 
                  );
                }}
                labels={({ datum }) => {
                  return(`${datum.dateLabel} \n${datum.y} min`);
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{ stroke: "tomato", strokeWidth: 2 }}
                  />
                }
              />
            </VictoryChart>
             <h2 className={this.props.nightMode ? "exit-bed-charts exit-bed-charts-heading exit-bed-charts-heading-night" : "exit-bed-charts-heading exit-bed-charts-heading-day"} title="The time you woke up. This could be before you got out of bed.">Minutes Early Awake</h2>
          </div>
      </>
    )
  }
}

export default MinutesEarlyWokeChart; 

MinutesEarlyWokeChart.propTypes = {
  dates: PropTypes.array
}
           