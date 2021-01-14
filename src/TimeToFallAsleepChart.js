import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, nightModeTransitionTime, flyoutStyleNight, victoryTooltipLabelStyle, getLongDate, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels} from './global_items';

const urlGetData = `${url}get-data`;

class TimeToFallAsleepChart extends React.Component {
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
          timeToFallAsleep: x.timeToFallAsleep
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
            timeToFallAsleep: x.timeToFallAsleep
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
      const showYesterdaysDate = true;
      const barGraph = true;
      data = createData1(chartInfo, this.props.range, 'timeToFallAsleep', showYesterdaysDate, barGraph);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'timeToFallAsleep', showYesterdaysDate, barGraph);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'timeToFallAsleep', showYesterdaysDate, barGraph);
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
                fixLabelOverlap={true}
                style={victoryAxisStyle('x', this.props.nightMode)}
                />
              <VictoryAxis
                style={{grid:{stroke:'black', strokeDasharray: '7'}}}
                dependentAxis
                tickFormat={(y) => `${y} min` }
                style={victoryAxisStyle('y', this.props.nightMode)}
              />
              <VictoryBar
                style={{
                  data: {
                    fill: this.props.nightMode ? 'rgb(0 168 255)' : '#00b6ba', 
                    transition: `fill ${nightModeTransitionTime}`
                  },
                  labels: {
                    fill: this.props.nightMode ? 'white' : 'black'
                  }
                }}
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
                  if (datum){
                    return(
                      `${datum.timeLabel}\n${datum.dateLabel}`
                    );
                  }
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={flyoutStyleNight(this.props.nightMode)}
                  />
                }
              />
            </VictoryChart>
              <h2 className={this.props.nightMode ? "enter-bed-charts-heading-night" : "enter-bed-charts-heading"} title="How long it took you to fall asleep after turning the lights off.">Time to Fall Asleep</h2>
          </div>
      </>
    )
  }
}

export default TimeToFallAsleepChart; 

TimeToFallAsleepChart.propTypes = {
  dates: PropTypes.array,
  nightMode: PropTypes.bool, 
  loggedInUser: PropTypes.string
}
           