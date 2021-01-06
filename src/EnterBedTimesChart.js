import React from 'react';
import { Container } from 'react-bootstrap';
import './EnterBedTimesChart.scss';
import { VictoryTooltip, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;
//make it so graph updates when component loads

class EnterBedTimesChart extends React.Component {
  state = {
    dates: [],
    chartInfo: []
  }
  componentDidUpdate(){
    c('state', this.state)
  }
  componentDidMount(){
    c('props', this.props);
    const {dates, chartInfo} = this.state;
    axios.post(urlGetData, {user: 'omar'})
    .then(res => {
      console.log(res);
      c('component mounted')
      if (dates.length === 0){
        //check what DATA IS COMING IN
        c('if running')
        c('res.data', res.data)
        let newDates = [];
        let newChartInfo = [];
        res.data.map(x => {
          newDates = [...newDates, x.date];
          newChartInfo = [...newChartInfo, {
            date: x.date,
            enterBedTime: x.enterBedTime
          }];
          c('newchartinfo', newChartInfo)
          return null;
        })
        c('chartInfooutsidemap', newChartInfo)
        this.setState({chartInfo: newChartInfo});
        this.setState({dates: newDates});
      } 
      // else {
      //   this.setState({dates: [], chartInfo: []});
      //   setDates([]);
      //   setNapInfo([]);
      //   res.data.map(x => {
      //     setDates(prev => [...prev, x.date]);
      //     setNapInfo(prev => [...prev, {
      //       date: x.date, 
      //       napStartTime: x.napStartTime,
      //       napEndTime: x.napEndTime
      //     }]);
      //     return null;
      //   })
      // }
    })
  }
  render() {
    const {dates, chartInfo} = this.state;
    const dateLabels = dates.filter(x => x).map((x, i) => {
      const date = new Date(Date.parse(x));
      return(
        `${date.getMonth()+1}/${date.getDate()}`
      )
    });
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      c('enter data write')
      data = chartInfo.filter(napObj => napObj.enterBedTime).map((e, i) => {
        //DATE JAN 1 2000 USED BECAUSE DATE NEEDED FOR TIME VALUE
        c('enterbedtime', e.enterBedTime)
        const dateTime = new Date(`January 1, 2000 ${e.enterBedTime}`);
        const dateTimeEnd = new Date(`January 1, 2000 ${e.napEndTime}`);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
        return(
          { x: date, y: dateTime }
        );
      });
      c('data in enterbedtimes',data)
    }
    return (
      <>
        <Container>
          <div className="victory-chart-1-container">
            <h2>Nap Times</h2>
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
          </div>
        </Container>
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

EnterBedTimesChart.propTypes = {
  dates: PropTypes.array
}