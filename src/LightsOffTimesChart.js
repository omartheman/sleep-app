import React from 'react';
import { Container } from 'react-bootstrap';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryScatter } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, VictoryScatterLineComplement, victoryLineStyle, getLongDate} from './global_items';

const urlGetData = `${url}get-data`;

class LightsOffTimesChart extends React.Component {
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
          lightsOffTime: x.lightsOffTime
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
            lightsOffTime: x.lightsOffTime
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
      data = chartInfo.filter(napObj => napObj.lightsOffTime).map((e, i, arr) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const dateTime = new Date(`January 1, 2000 ${e.lightsOffTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400) - 1;
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date) - 1000*86400);
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        dateLabels = [...dateLabels, dateLabel];
        return(
          { x: date, y: dateTime, dateLabel: getLongDate(dateLabelPrimer), timeLabel: formatAMPM(dateTime) }
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