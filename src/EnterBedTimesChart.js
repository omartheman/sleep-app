import React from 'react';
import { Container } from 'react-bootstrap';
import './EnterBedTimesChart.scss';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryTooltip, VictoryScatter } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, nightModeTransitionTime, victoryAxisStyle, getLongDate,  VictoryScatterLineComplement, victoryLineStyle, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels, createChartInfo} from './global_items';

const urlGetData = `${url}get-data`;
//make it so graph updates when component loads

class EnterBedTimesChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    if (this.props.loggedInUser && this.props.loggedInUser !== '') {
      createChartInfo(urlGetData, this.props.loggedInUser, 'enterBedTime', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    } else { 
      createChartInfo(urlGetData, 'sample', 'enterBedTime', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    }
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser !== ''){
      createChartInfo(urlGetData, this.props.loggedInUser, 'enterBedTime', function(response){
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
      data = createData1(chartInfo, this.props.range, 'enterBedTime', showYesterdaysDate);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'enterBedTime', showYesterdaysDate);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'enterBedTime', showYesterdaysDate);
    }
    c('data', data)
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
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              fixLabelOverlap={true}
              style={victoryAxisStyle('x', this.props.nightMode)}
              />
            <VictoryAxis
              style={victoryAxisStyle('y', this.props.nightMode)}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
            />
            <VictoryLine
              data={data}
              style={victoryLineStyle(this.props.nightMode, 'enterBedCharts')}
            />
            {VictoryScatterLineComplement(data, this.props.nightMode, 'enterBedCharts')}
          </VictoryChart>
          <h2 className={this.props.nightMode ? "enter-bed-charts enter-bed-charts-heading-night" : "enter-bed-charts-heading"} title="This is the time that you entered your bed - you may not yet have turned the lights off.">Time in Bed</h2>
        </div>
      </>
    )
  }
}

export default EnterBedTimesChart; 

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

EnterBedTimesChart.propTypes = {
  dates: PropTypes.array,
  nightMode: PropTypes.bool, 
  loggedInUser: PropTypes.string
}