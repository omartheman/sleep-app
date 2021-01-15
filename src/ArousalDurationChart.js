import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip, VictoryStack } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, flyoutStyleNight, getLongDate, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels} from './global_items';

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
    const chartInfoPrimer = this.state.chartInfo;
    const chartInfo = chartInfoPrimer.slice(0).reverse();
    let dateLabels = [];
    let xAxisTickValues = [];
    let data = [];
    if (chartInfo.length > 0) {
      const showYesterdaysDate = true;
      const barGraph = false;
      data = createData1(chartInfo, this.props.range, 'arousalDuration', showYesterdaysDate, barGraph);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'arousalDuration', showYesterdaysDate, barGraph);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'arousalDuration', showYesterdaysDate, barGraph);
    }

    const maxNumberArousals = Math.max(...data.map(x => x.length));
    const arousals = [];
    const bars = [];
    //A SEPERATE ARRAY IS CREATED FOR EACH AROUSAL: THE FIRST, SECOND, ETC., ALL THE WAY UNTIL THE MAX NUMBER OF AROUSALS FOR THE GIVEN DATA SET
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

    const createBars = () => {
      for (let i = 0; i < maxNumberArousals; i++){
        bars.push(
          <VictoryBar
            style={{
              labels: {
                fill: this.props.nightMode ? 'white' : 'black'
              }
            }}
            key={i}
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
              return(`${datum.y} min\n${datum.dateLabel}`);
            }}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={flyoutStyleNight(this.props.nightMode)}
              />
            }
          />
        )
      }
    }
    createBars();
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
                fixLabelOverlap={true}
                style={victoryAxisStyle('x', this.props.nightMode)}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(y) => `${y} min` }
                style={victoryAxisStyle('y', this.props.nightMode)}
              />
              <VictoryStack
                colorScale={
                  this.props.nightMode ? 
                  ['rgb(67 0 255)', 
                  'rgb(244 0 255)', 
                  'rgb(8 190 0)', 
                  'rgb(255 217 0)', 
                  'red']
                  : 
                  ['rgb(126 81 255)', 
                  'rgb(244 0 255)', 
                  'rgb(8 190 0)', 
                  'rgb(255 134 0)', 
                  'red']
                }
              >
                {[...bars]}
              </VictoryStack>
            </VictoryChart>
            <h2 
              className={
                `charts-heading ${this.props.nightMode ?
                  'quality-rating-charts-heading-night'  
                  : 'quality-rating-charts-heading-day'
                }`
              }
              title="The amounts of time you were awake last night. Each colored bar represents a seperate time waking up."
            >
              Arousal Durations
            </h2>
          </div>
      </>
    )
  }
}

export default ArousalDurationChart; 

ArousalDurationChart.propTypes = {
  dates: PropTypes.array
}
           