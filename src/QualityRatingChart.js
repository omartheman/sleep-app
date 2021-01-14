import React from 'react';
import { VictoryChart, VictoryAxis, VictoryTheme, VictoryBar, VictoryLabel, VictoryTooltip } from 'victory';
import PropTypes from 'prop-types';
import axios from 'axios';
import {url, c, victoryAxisStyle, nightModeTransitionTime, flyoutStyleNight, yesterdaysDate, yesterdaysDateLabelPrimer, createData1, createXAxisTickValues, createDateLabels} from './global_items';

const urlGetData = `${url}get-data`;

class QualityRatingChart extends React.Component {
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
          qualityRating: x.qualityRating
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
            qualityRating: x.qualityRating
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
      const showYesterdaysDate = false;
      const barGraph = true;
      data = createData1(chartInfo, this.props.range, 'qualityRating', showYesterdaysDate, barGraph);
      dateLabels = createDateLabels(chartInfo, this.props.range, 'qualityRating', showYesterdaysDate, barGraph);
      xAxisTickValues = createXAxisTickValues(chartInfo, this.props.range, 'qualityRating', showYesterdaysDate, barGraph);
    }
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
                style={{grid:{stroke:'black', strokeDasharray: '7'}}}
                dependentAxis
                tickFormat={(y) => `${y}`}
                style={victoryAxisStyle('y', this.props.nightMode)}
              />
              <VictoryBar
                style={{
                  data: {
                    fill: this.props.nightMode ? 'rgb(173 31 255)' : 'rgb(37 39 255)', 
                    transition: `fill ${nightModeTransitionTime}`
                  },
                  labels: {
                    fill: this.props.nightMode ? 'white' : 'black'
                  }
                }}
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
                  return(`${datum.y} out of 5\n${datum.dateLabel}`);
                }}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={flyoutStyleNight(this.props.nightMode)}
                  />
                }
              />
            </VictoryChart>
            <h2 
              className={
                `charts-heading ${this.props.nightMode ?
                  'quality-rating-charts-heading-night'  
                  : 'quality-rating-charts-heading-day'
                }`
              }
              title="A rating out of 5 of how well you slept last night."
            >
              Sleep Quality Rating
            </h2>
          </div>
      </>
    )
  }
}

export default QualityRatingChart; 

QualityRatingChart.propTypes = {
  dates: PropTypes.array
}
           