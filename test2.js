<VictoryChart
  width={WIDTH}
>
  <VictoryAxis
    tickLabelComponent={<VictoryLabel dy={0} dx={10} angle={55}/>}
    tickValues={xAxisTickValues}
    tickFormat={dateLabels}
    style={{
      axis: {
        stroke:'white'  //CHANGE COLOR OF X-AXIS
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
    tickFormat={(y) => y}
    style={{
      axis: {
        stroke:'white'  //CHANGE COLOR OF Y-AXIS
      },
      tickLabels: {
        fill: 'white' //CHANGE COLOR OF Y-AXIS LABELS
      }, 
      grid: {
        stroke: 'white', //CHANGE COLOR OF Y-AXIS GRID LINES
        strokeDasharray: '7',
      }
    }}
  />
  <VictoryArea 
    data={outcome} 
    x="quarter" 
    y="earnings" 
    style={{ 
      data: { 
        fill: '#0074B7', 
        fillOpacity: 0.7, 
        stroke: '#0C7BBB', 
        strokeWidth: 1 
      } 
    }} 
  />
</VictoryChart>