import React from 'react';
import { Container } from 'react-bootstrap';
import './NapTimesChart.scss';
import { VictoryTooltip, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class NapTimesChart extends React.Component {
  state = {
    chartInfo: []
  };
  componentDidMount(){
    axios.post(urlGetData, {user: this.props.loggedInUser})
    .then(res => {
        let newNapInfo = [];
        res.data.map(x => {
          newNapInfo = [...newNapInfo, {
            date: x.date, 
            napStartTime: x.napStartTime,
            napEndTime: x.napEndTime
          }]
          return null;
        })
        this.setState({chartInfo: newNapInfo});
    })
  }
  componentDidUpdate(prevProps){
    if (prevProps.loggedInUser !== this.props.loggedInUser){
      axios.post(urlGetData, {user: this.props.loggedInUser})
      .then(res => {
          let newNapInfo = [];
          res.data.map(x => {
            newNapInfo = [...newNapInfo, {
              date: x.date, 
              napStartTime: x.napStartTime,
              napEndTime: x.napEndTime
            }]
            return null;
          })
          this.setState({chartInfo: newNapInfo});
      })
    }
  }
  render() {
    const {chartInfo} = this.state;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      data = chartInfo.filter(napObj => napObj.napStartTime).map((e, i, arr) => {
        const dateTime = new Date(`January 1, 2000 ${e.napStartTime}`);
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        const firstDate = Math.floor(Date.parse(arr[0].date)/1000/86400);
        const lastDate = Math.floor(Date.parse(arr[arr.length - 1].date)/1000/86400);
        const dateDiff = lastDate - firstDate;
        dateLabels = [...dateLabels, dateLabel];
        // if (dateDiff < 15) {
        //   dateLabels = [...dateLabels, dateLabel];
        // } else {
        //   if (date % 2 === 0){
        //     dateLabels = [...dateLabels, null]
        //   } else {
        //     dateLabels = [...dateLabels, dateLabel];
        //   }
        // }
        return(
          { x: date, y0: dateTime, y: dateTimeEnd }
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
              fixLabelOverlap={true}
              tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
              />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
            />
            <VictoryBar
              data={data}
              barWidth={() => {
                let firstDate;
                let lastDate;
                let dateDiff;
                if (data) {
                  firstDate = data[0].barWidthDate; 
                  lastDate = data[data.length - 1].barWidthDate; 
                  dateDiff = lastDate - firstDate;
                }
                return(
                  dateDiff < 10 ? 18
                  : dateDiff < 20 ? 8
                  : 4 
                );
              }}
              cornerRadius={{topLeft: 3, topRight: 3, bottomLeft: 3, bottomRight: 3}}
              style={{ data: {fill: '#964c9d'} }}
              labels={({ datum }) => {
                return(duration(new Date(datum._y0), new Date(datum._y)))}
              }
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ stroke: "tomato", strokeWidth: 2 }}
                  // centerOffset={{ y: 45 }}
                />
              }
            />
          </VictoryChart>
          <h2>Nap Times</h2>
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