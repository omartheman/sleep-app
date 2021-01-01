import React, {Component} from 'react';
import './GraphTest.scss';
import * as V from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory';

function c (msg, input) {return(console.log(`${msg}: `, input))};

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
        c('napstarttime', e.napStartTime)
        c('datetime', new Date(`January 1, 2000 ${e.napStartTime}`))
        const dateTime = new Date(`January 1, 2000 ${e.napStartTime}`);
        const time = e.napStartTime.split(':');
        const timeNumber = Number(time[0]) + Number(time[1]/60);
        const date = Math.floor(Date.parse(e.date)/1000/86400);
        xAxisTickValues = [...xAxisTickValues, date];
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
              tickFormat={(y) => formatAMPM(y)}
              // tickFormat={(y) => {
              //   return(
              //     `${y-y%1}:${Math.round(y%1*10)/10*60}PM`
              //   );
              // }}
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
      </>
    )
  }
}

export default GraphTest; 