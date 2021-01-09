import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class SleepAidItemChart extends React.Component {
  state = {
    chartInfo: []
  }
  componentDidMount(){
    axios.post(urlGetData, {user: 'omar'})
    .then(res => {
      console.log(res);
      let newChartInfo = [];
      res.data.map(x => {
        newChartInfo = [...newChartInfo, {
          date: x.date,
          sleepAidItem: x.sleepAidItem
        }];
        return null;
      })
      this.setState({chartInfo: newChartInfo});
    })
  }
  render() {
    const {chartInfo} = this.state;
    let dateLabels = [];
    let xAxisTickValues = [];
    let data;
    if (chartInfo.length > 1) {
      data = chartInfo.filter(napObj => napObj.sleepAidItem || napObj.sleepAidItem === 0).map((e, i, arr) => {
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
        c('e.minearly', e.sleepAidItem)
        const sleepAidMg = e.sleepAidItem.match(/\d+/g);
        const sleepAidItem = e.sleepAidItem.match(/(?<=\s+)[A-Za-z]+/g)[0];
        c('sleepaiditem', sleepAidItem)
        var weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const longDateLabel = `${weekday[dateLabelPrimer.getDay()]}, ${month[dateLabelPrimer.getMonth()]} ${dateLabelPrimer.getDate()}`;
        return(
          { x: date, y: sleepAidMg, dateLabel: longDateLabel, sleepAidItem: sleepAidItem}
        );
      });
    }
    return (
      <>
          <div className="victory-chart-1-container">
            <h2>Sleep Aid Item</h2>
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
                />
              <VictoryAxis
                style={{grid:{stroke:'black', strokeDasharray: '7'}}}
                dependentAxis
                tickFormat={(y) => `${y} mg/oz` }
              />
              <VictoryBar
                data={data}
                barWidth={() => {
                  let firstDate;
                  let lastDate;
                  let dateDiff;
                  if (data) {
                    firstDate = data[0].x; 
                    lastDate = data[data.length - 1].x; 
                    dateDiff = lastDate - firstDate;
                  }
                  return(
                    dateDiff < 10 ? 18
                    : dateDiff < 20 ? 8
                    : 4 
                  );
                }}
                labels={({ datum }) => {
                  if (datum.sleepAidItem){
                    return(datum.sleepAidItem.toLowerCase() === 'alcohol' ?
                      `${datum.dateLabel}\n${datum.y}oz ${datum.sleepAidItem}`
                      :
                      `${datum.dateLabel} \n${datum.y}mg ${datum.sleepAidItem}`
                      );
                  }
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{ stroke: "tomato", strokeWidth: 2 }}
                  />
                }
              />
            </VictoryChart>
          </div>
      </>
    )
  }
}

export default SleepAidItemChart; 

SleepAidItemChart.propTypes = {
  dates: PropTypes.array
}
           