import React, {Component} from 'react';
import './GraphTest.scss';
import * as V from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory';

function c (msg, input) {return(console.log(`${msg}: `, input))};

class GraphTest extends React.Component {
  render() {
    const {dates, napStartTimes, napInfo} = this.props;
    const dateLabels = dates.map((x, i) => {
      const date = new Date(Date.parse(x));
      return(
        `${date.getMonth()+1}/${date.getDate()}`
      )
    });
    let xAxisTickValues = [];
    let data;
    if (napInfo.length > 1) {
      data = napInfo.map((e, i) => {
        const time = e.napStartTime.split(':');
        const timeNumber = Number(time[0]) + Number(time[1]/60);
        c('timenum', timeNumber);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        c('date', date);
        xAxisTickValues = [...xAxisTickValues, date];
        return(
          { x: date, y: timeNumber }
        );
      });
    }
    console.log('ticks', xAxisTickValues);
    return (
      <>
        <div className="victory-chart-1-container">
          <VictoryChart
            theme={VictoryTheme.material}
            padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
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
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(y) => (`${y}PM`)}
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
              }}
              data={data}
            />
          </VictoryChart>
        </div>



        <VictoryChart
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          domainPadding={20}
        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={[1, 2, 3, 4]}
            tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
          />
          <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            tickFormat={(x) => (`$${x / 1000}k`)}
          />
          <VictoryBar
            data={data}
            x="quarter"
            y="earnings"
          />
        </VictoryChart>
      </>
    )
  }
}

export default GraphTest; 