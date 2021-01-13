<VictoryChart
  theme={VictoryTheme.material}
  padding={{ left: 70, top: 20, right: 30, bottom: 50 }}
  scale={{y:'time'}}
  domainPadding={{ x: 20, y: 20 }}
>
  <VictoryAxis
    tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
    tickValues={xAxisTickValues}
    tickFormat={dateLabels}
    style={{
      axis: {
        stroke:'white'
      },
      tickLabels: {
        fill: 'white' //CHANGE COLOR OF X-AXIS LABELS
      }, 
      grid: {
          stroke: 'white', //CHANGE COLOR OF X-AXIS GRID LINES
          strokeDasharray: '7',
      }
    }}
  />
  <VictoryAxis
    dependentAxis
    tickFormat={(y) => formatAMPM(y)}
    style={{
      axis: {
        stroke:'whi'
      },
      tickLabels: {
        fill: 'white' //CHANGE COLOR OF X-AXIS LABELS
      }, 
      grid: {
        stroke: 'white', //CHANGE COLOR OF Y-AXIS GRID LINES
        strokeDasharray: '7',
      }
    }}
  />
  <VictoryScatter
    style={
      { 
        data: { fill: "#c43a31" }, 
        labels: {fill: 'white'} //CHANGE COLOR OF LABELS FOR TOOLTIPS
      }
    }
    size={4}
    data={data}
    labels={({ datum }) => {
      if (datum){
        return(
          `${datum.timeLabel}\n${datum.dateLabel}`
        );
      }
    }}
    labelComponent={
      <VictoryTooltip
        flyoutStyle={{ 
          stroke: 'white', 
          fill: 'black',
          strokeWidth: 2 
        }}
      />
    }
  />
</VictoryChart>