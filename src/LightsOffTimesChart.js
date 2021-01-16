import React from 'react';
import { Container } from 'react-bootstrap';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryScatter } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, VictoryScatterLineComplement, victoryLineStyle, getLongDate, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels, createChartInfo} from './global_items';

const urlGetData = `${url}get-data`;

class LightsOffTimesChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    if (this.props.loggedInUser && this.props.loggedInUser !== '') {
      createChartInfo(urlGetData, this.props.loggedInUser, 'lightsOffTime', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    } else { 
      createChartInfo(urlGetData, 'sample', 'lightsOffTime', function(response){
        this.setState({chartInfo: response});
      }.bind(this))
    }
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser !== ''){
      createChartInfo(urlGetData, this.props.loggedInUser, 'lightsOffTime', function(response){
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
      data = createData1(chartInfo, this.props.range, 'lightsOffTime', showYesterdaysDate);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'lightsOffTime', showYesterdaysDate);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'lightsOffTime', showYesterdaysDate);
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
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              fixLabelOverlap={true}
              style={victoryAxisStyle('x', this.props.nightMode)}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
              style={victoryAxisStyle('y', this.props.nightMode)}
            />
            <VictoryLine
              data={data}
              style={victoryLineStyle(this.props.nightMode, 'enterBedCharts')}
            />
            {VictoryScatterLineComplement(data, this.props.nightMode, 'enterBedCharts')}
          </VictoryChart>
          <h2 className={this.props.nightMode ? "enter-bed-charts-heading-night" : "enter-bed-charts-heading"} title="The time you turned the lights off after getting in bed.">Time Lights Off</h2>
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