import React, {Component} from 'react';
import './GraphTest.scss';
import * as V from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory';

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

class GraphTest extends React.Component {
  render() {
    if (this.props.napStartTimes){
      console.log('nap start times in GraphTest render', this.props.napStartTimes);
    }
    const {dates, napStartTimes} = this.props;
    const tickValues = dates.map((x, i) => {
      return(i+1)
    });
    const dateLabels = dates.map((x, i) => {
      const date = new Date(Date.parse(x));
      return(
        `${date.getMonth()+1}/${date.getDate()}`
      )
    });
    
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 7 }
    ];

    // const data = napStartTimes.map((x, i) => {
    //   return({x: i+1, y: )
    // })
    console.log('ticks', tickValues);
    return (
      <>
        <VictoryChart
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            // tickValues={[1, 2, 3, 4, 5]}
            tickValues={tickValues}
            // tickFormat={["1 Jan", "2 Jan", "3 Jan", "Quarter 4"]}
            tickFormat={dateLabels}
          />
          <VictoryAxis
            dependentAxis
            // tickFormat specifies how ticks should be displayed
            tickFormat={(x) => (`${x}PM`)}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 3 },
              { x: 3, y: 5 },
              { x: 4, y: 4 },
              { x: 5, y: 7 }
            ]}
          />
        </VictoryChart>
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