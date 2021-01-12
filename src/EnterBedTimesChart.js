import React from 'react';
import { Container } from 'react-bootstrap';
import './EnterBedTimesChart.scss';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel, VictoryScatter } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, nightModeTransitionTime, victoryAxisStyle, VictoryScatterLineComplement} from './global_items';

const urlGetData = `${url}get-data`;
//make it so graph updates when component loads

class EnterBedTimesChart extends React.Component {
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
          enterBedTime: x.enterBedTime
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
            enterBedTime: x.enterBedTime
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
      data = chartInfo.filter(napObj => napObj.enterBedTime).map((e, i, arr) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const dateTime = new Date(`January 1, 2000 ${e.enterBedTime}`);
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
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
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              tickValues={xAxisTickValues}
              tickFormat={dateLabels}
              style={victoryAxisStyle('x', this.props.nightMode)}
              />
            <VictoryAxis
              style={victoryAxisStyle('y', this.props.nightMode)}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
            />
            <VictoryLine
              data={data}
              style={this.props.nightMode ? 
                {data: {
                  stroke: '#00ffcb',
                  transition: `stroke ${nightModeTransitionTime}`
                }}
                : {data: {
                    stroke: '#06790f',
                    transition: `stroke ${nightModeTransitionTime}`
                  }}
              }
            />
            {VictoryScatterLineComplement(data)}
          </VictoryChart>
          <h2 className={this.props.nightMode ? "enter-bed-charts-heading-night" : "enter-bed-charts-heading"} title="This is the time that you entered your bed - you may not yet have turned the lights off.">Time I Got in Bed</h2>
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