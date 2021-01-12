import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip, VictoryStack } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c} from './global_items';

const urlGetData = `${url}get-data`;

class ArousalDurationChart extends React.Component {
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
          arousalDuration: x.arousalDuration
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
            arousalDuration: x.arousalDuration
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
    let data = [];
    if (chartInfo.length > 1) {
      data =  chartInfo.filter(napObj => napObj.arousalDuration).map((e, i, arr) => {
        const durations = e.arousalDuration.match(/\d+/g).map(x => Number(x));
        c('durations',durations)
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
        let durationData = [];
        for (let i = 0; i < durations.length; i++) {
          durationData = [...durationData, 
            { x: date, y: durations[i], dateLabel: dateLabel}
          ];
        }
        return(durationData);
      });
    }
    //SORT DATA INTO AROUSAL1 AROUSAL2 AROUSAL3... 
    //FIRST FILL AROUSALS WITH CORRECT # EMPTY ARRAYS
    //then do a forEach, and you need  
    c('data',data)

    const maxNumberArousals = Math.max(...data.map(x => x.length));
    const arousals = [];
    const bars = [];
    //find the date with the most arousals, and push this many arrays to 'arousals'
    //data.length only gives how many dates. 
    for (let i = 0; i < maxNumberArousals; i++){
      arousals.push([]);
    }
    data.forEach((x, i) => {
      for (let i = 0; i < maxNumberArousals; i++){
        if (x[i]){
          arousals[i].push(x[i]);
        }
      }
    })
    let firstDate;
    let lastDate;
    if (arousals[0]) {
      firstDate = arousals[0][0].x;
      lastDate = arousals[0][arousals[0].length - 1].x;
    }
    c('arousals', arousals)

    const createBars = () => {
      for (let i = 0; i < maxNumberArousals; i++){
        c('for', i)
        bars.push(
          <VictoryBar
            data={arousals[i]}
            barWidth={() => {
              let dateDiff;
              if (data) {
                dateDiff = lastDate - firstDate;
              }
              return(
                dateDiff < 10 ? 18
                : dateDiff < 20 ? 8
                : 4 
              );
            }}
            labels={({ datum }) => {
              return(`${datum.dateLabel} \n${datum.y} min`);
            }}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{ stroke: "tomato", strokeWidth: 2 }}
              />
            }
          />
        )
      }
    }
    createBars();

    data.forEach((x, i) => c(`data foreach ${i}`, x))
    return (
      <>
          <div className="victory-chart-1-container">
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
                tickFormat={(y) => `${y} min` }
              />
              <VictoryStack>
                {[...bars]}
              </VictoryStack>
            </VictoryChart>
            <h2>Arousal Durations</h2>
          </div>
      </>
    )
  }
}

export default ArousalDurationChart; 

ArousalDurationChart.propTypes = {
  dates: PropTypes.array
}
           