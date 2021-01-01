import './App.css';
import GraphTest from './GraphTest';
import {useEffect, useState} from 'react';
import axios from 'axios';

const url = 'http://localhost:4000/sleep/api/upload-data';
const urlGetData = 'http://localhost:4000/sleep/api/get-data';

function App() {
  const [napStartTimes, setNapStartTimes] = useState([]);
  const [dates, setDates] = useState([]);
  const [napInfo, setNapInfo] = useState([]);
  useEffect(() => {
    axios.post(urlGetData, {username: 'omar'})
    .then(res => {
      console.log(res);
      res.data.map(x => {
        setNapStartTimes(prev => [...prev, x.napStartTime]);
        setDates(prev => [...prev, x.date]);
        setNapInfo(prev => [...prev, {
          date: x.date, 
          napStartTime: x.napStartTime,
          napEndTime: x.napEndTime
        }])
      })
    })
  }, [])
  useEffect(() => {
    console.log('napStartTimes', napStartTimes)
    console.log('dates', dates)
  })
  return (
    <div className="App">
      <GraphTest
        napStartTimes={napStartTimes}
        dates={dates}
        napInfo={napInfo}
      />
    </div>
  );
}

export default App;
