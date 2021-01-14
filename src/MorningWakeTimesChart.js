import React from 'react';
import { Container } from 'react-bootstrap';
import './MorningWakeTimesChart.scss';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, getLongDate, VictoryScatterLineComplement, victoryAxisStyle, victoryLineStyle, createData1, createXAxisTickValues, createDateLabels} from './global_items';

const urlGetData = `${url}get-data`;

class MorningWakeTimesChart extends React.Component {
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
    if (chartInfo.length > 0) {
      const showYesterdaysDate = false;
      data = createData1(chartInfo, this.props.range, 'morningWakeTime', showYesterdaysDate);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'morningWakeTime', showYesterdaysDate);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'morningWakeTime', showYesterdaysDate);
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
              style={victoryAxisStyle('x', this.props.nightMode)}
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              fixLabelOverlap={true}
            />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
              style={victoryAxisStyle('y', this.props.nightMode)}
            />
            <VictoryLine
              data={data}
              style={victoryLineStyle(this.props.nightMode, 'exitBedCharts')}
            />
            {VictoryScatterLineComplement(data, this.props.nightMode, 'exitBedCharts')}
          </VictoryChart>
          <h2 className={this.props.nightMode ? "exit-bed-charts exit-bed-charts-heading exit-bed-charts-heading-night" : "exit-bed-charts-heading exit-bed-charts-heading-day"} title="The time you woke up. This could be before you got out of bed.">Wake Up Time</h2>
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