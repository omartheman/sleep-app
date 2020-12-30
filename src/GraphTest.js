import React, {Component} from 'react';
import './GraphTest.scss';
import * as V from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

const GraphTest = () => {
  // Last night I got into bed at: 
  const data = [8.5, 9.5, 8, 8, 8.9, 8.2, 10, 10.5, 8]
  // const data = [100, 200, 400]
  const w = 500;
  const h = 200;
  const p = 30;
  const hg = h - p;
  const wg = w - p;
  const points = data.map((ele, ind) => {
    const y = p + hg - (ele - 5)/6 * hg;
    // const y = h - (ele - 5)/7 * h;
    const x = p + wg/(data.length-1) * ind;
    // const x = (w-p)/(data.length-1) * ind + p;

    return `${x},${y}`;
  })
  .join(' ');
  const horizontalGuides = data.map((x, ind) => {
    return(
      <polyline className="horizontal-guides"
        points={`${p},${hg/6*ind} ${wg+p},${hg/6*ind}`}
        fill="none" 
        stroke="grey" 
      />
    )
  })
  const horizontalLabels = data.map((x, ind) => {
    return(
      <polyline className="horizontal-guides"
        points={`${p},${hg/6*ind} ${wg},${hg/6*ind}`}
        fill="none" 
        stroke="grey" 
      />
    )
  })
  return(
    <>
      <h1>GraphTest</h1>
      <div className="graph-A-container">
        <svg width={w} height={h} viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
          <polyline points={`${p},${p} ${p},${h-p}`}
            fill="none" stroke="grey" />
          {horizontalGuides}
          <polyline className="polyline-sleep-times" points={points}
            fill="none" stroke="black" 
          />
          <text x="0" y="100"
          style={{ fill: '#000', fontSize: `15px`, fontFamily: 'Helvetica' }}
          >
            Lab
          </text>
        </svg>
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

export default GraphTest; 