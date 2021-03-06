import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip } from 'victory';
import PropTypes from 'prop-types';
import {url, c, victoryAxisStyle, nightModeTransitionTime, flyoutStyleNight, createData1, createXAxisTickValues, createDateLabels, createChartInfo} from './global_items';

const urlGetData = `${url}get-data`;

class MinutesEarlyWokeChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    if (this.props.loggedInUser && this.props.loggedInUser !== '') {
      createChartInfo(urlGetData, this.props.loggedInUser, 'minutesEarlyWoke', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    } else { 
      createChartInfo(urlGetData, 'sample', 'minutesEarlyWoke', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    }
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser !== ''){
      createChartInfo(urlGetData, this.props.loggedInUser, 'minutesEarlyWoke', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    }
  }
  render() {
    const {chartInfo} = this.state;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 0) {
      const showYesterdaysDate = false;
      const barGraph = true;
      data = createData1(chartInfo, this.props.range, 'minutesEarlyWoke', showYesterdaysDate, barGraph);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'minutesEarlyWoke', showYesterdaysDate, barGraph);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'minutesEarlyWoke', showYesterdaysDate, barGraph);
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
                fixLabelOverlap={true}
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
                    fill: this.props.nightMode ? 'rgb(255 52 0)' : 'rgb(186 0 177)', 
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
                    firstDate = data[data.length - 1].x; 
                    lastDate = data[0].x; 
                    dateDiff = lastDate - firstDate;
                  }
                  return(
                    dateDiff < 10 ? 18
                    : dateDiff < 20 ? 8
                    : 4 
                  );
                }}
                labels={({ datum }) => {
                  return(`${datum.y} min\n${datum.dateLabel}`);
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={flyoutStyleNight(this.props.nightMode)}
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
           