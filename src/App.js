import logo from './logo.svg';
import './App.css';
import GraphTest from './GraphTest';
import AddData from './AddData';
import {useEffect, useState} from 'react';
import axios from 'axios';

const url = 'http://localhost:4000/sleep/api/upload-data';
const urlGetData = 'http://localhost:4000/sleep/api/get-data';

function App() {
  const [napStartTimes, setNapStartTimes] = useState([]);
  const [dates, setDates] = useState([]);
  useEffect(() => {
    axios.post(urlGetData, {username: 'omar'})
    .then(res => {
      console.log(res);
      res.data.map(x => {
        setNapStartTimes(prev => [...prev, x.napStartTime]);
        setDates(prev => [...prev, x.date]);
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
      />
    </div>
  );
}

export default App;
