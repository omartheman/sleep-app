import React from 'react';
import { Container } from 'react-bootstrap';
import './NapTimesChart.scss';
import { VictoryTooltip, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, nightModeTransitionTime, flyoutStyleNight, getLongDate, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels, createChartInfo} from './global_items';

const urlGetData = `${url}get-data`;

class NapTimesChart extends React.Component {
  state = {
    chartInfo: []
  };
  componentDidMount(){
    if (this.props.loggedInUser && this.props.loggedInUser !== '') {
      createChartInfo(urlGetData, this.props.loggedInUser, 'napTimes', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    } else { 
      createChartInfo(urlGetData, 'sample', 'napTimes', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    }
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser !== ''){
      createChartInfo(urlGetData, this.props.loggedInUser, 'napTimes', function(response){
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
      const showYesterdaysDate = true;
      const barGraph = false;
      data = createData1(chartInfo, this.props.range, 'napStartTime', showYesterdaysDate, barGraph);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'napStartTime', showYesterdaysDate, barGraph);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'napStartTime', showYesterdaysDate, barGraph);
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
              fixLabelOverlap={true}
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              style={victoryAxisStyle('x', this.props.nightMode)}
            />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
              style={victoryAxisStyle('y', this.props.nightMode)}
            />
            <VictoryBar
              style={{
                data: {
                  fill: this.props.nightMode ? 'rgb(255 0 113)' : 'rgb(129 33 255)', 
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
              cornerRadius={{topLeft: 3, topRight: 3, bottomLeft: 3, bottomRight: 3}}
              labels={({ datum }) => {
                return(
                  `${duration(new Date(datum._y0), new Date(datum._y))}\n${datum.dateLabel}`
                )}
              }
              
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={flyoutStyleNight(this.props.nightMode)}
                />
              }
            />
          </VictoryChart>
          <h2 
            className={
              `charts-heading ${this.props.nightMode ?
                'quality-rating-charts-heading-night'  
                : 'quality-rating-charts-heading-day'
              }`
            }
            title="The range of time from the beggining of your first nap to the end of your last nap."
          >
            Nap Times
          </h2>
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