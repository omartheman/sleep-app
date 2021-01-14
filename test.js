
const createData1 = (chartInfo, range) => {
  return(
    chartInfo.filter((dataObj, i) => i < range && dataObj.enterBedTime).map((e, i, arr) => {
      const dateTime = new Date(`January 1, 2000 ${e.enterBedTime}`);
      const date = yesterdaysDate(e.date);
      
      const dateLabelPrimer = yesterdaysDateLabelPrimer(e.date);
      const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 
      dateLabels = [...dateLabels, dateLabel];
      return(
        { x: date, y: dateTime, dateLabel: getLongDate(dateLabelPrimer), timeLabel: formatAMPM(dateTime) }
      );
    })
  ) 
}
const createXAxisTickValues = (chartInfo, range) => {
  let xAxisTickValues = [];
  chartInfo.filter((dataObj, i) => i < range && dataObj.enterBedTime).forEach((e, i, arr) => {
    const date = yesterdaysDate(e.date);
    xAxisTickValues = [...xAxisTickValues, date];
  })
  return xAxisTickValues;
}
const createDateLabels = (chartInfo, range) => {
  let dateLabels = [];
  chartInfo.filter((dataObj, i) => i < range && dataObj.enterBedTime).forEach((e, i, arr) => {
    const dateLabelPrimer = yesterdaysDateLabelPrimer(e.date);
    const dateLabel = `${dateLabelPrimer.getMonth()+1}/${dateLabelPrimer.getDate()}`; 

    dateLabels = [...dateLabels, dateLabel];
  })
  return dateLabels;
}
