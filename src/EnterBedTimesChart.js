import React from 'react';
import { Container } from 'react-bootstrap';
import './EnterBedTimesChart.scss';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryLabel } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

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
      data = chartInfo.filter(napObj => napObj.enterBedTime).map((e, i) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        const dateTime = new Date(`January 1, 2000 ${e.enterBedTime}`);
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        const dateLabelPrimer = new Date(Date.parse(e.date));
        const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
        dateLabels = [...dateLabels, dateLabel];
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
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              // tickValues={[1, 2, 3, 4, 5]}
              tickValues={xAxisTickValues}
              // tickFormat={["1 Jan", "2 Jan", "3 Jan", "Quarter 4"]}
              tickFormat={dateLabels}
              />
            <VictoryAxis
              style={{grid:{stroke:'black', strokeDasharray: '7'}}}
              dependentAxis
              tickFormat={(y) => formatAMPM(y)}
              // tickFormat specifies how ticks should be displayed
              // tickFormat={(y) => {
              //   return(
              //     `${y-y%1}:${Math.round(y%1*10)/10*60}PM`
              //   );
              // }}
            />
            <VictoryLine
              data={data}
            />
          </VictoryChart>
          <h2>Time I Got in Bed</h2>
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
  dates: PropTypes.array
}