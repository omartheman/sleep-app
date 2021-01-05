import { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { Calendar } from 'react-calendar';
import './AddData.scss';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import {c, getClickedDate, url} from './global_items';

const urlCheckExistingData = `${url}check-existing-data`;
const urlUploadData = `${url}upload-data`;

axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.withCredentials = true;

function AddData () {
  const [value, onChange] = useState(new Date());
  const [date, setDate] = useState(null);
  const [existingDataAlert, setExistingDataAlert] = useState(false);
  const [existingNapStart, setExistingNapStart] = useState('');
  const [existingNapEnd, setExistingNapEnd] = useState('');
  const [sleepAidItem, setSleepAidItem] = useState('');
  const [sleepAidMg, setSleepAidMg] = useState('');
  const [enterBedTime, setEnterBedTime] = useState('');
  const [lightsOffTime, setLightsOffTime] = useState('');
  const [timeToFallAsleep, setTimeToFallAsleep] = useState('');
  const [numberTimesArousal, setNumberTimesArousal] = useState('');
  const [arousalDuration, setArousalDuration] = useState('');
  const [morningWakeTime, setMorningWakeTime] = useState('');
  const [exitBedTime, setExitBedTime] = useState('');
  const [minutesEarlyWoke, setMinutesEarlyWoke] = useState('');
  const [qualityRating, setQualityRating] = useState('');

  const [clickedDate, setClickedDate] = useState(null);

  const checkExistingData = (clickedDate) => {
    axios.post(urlCheckExistingData, {clickedDate: getClickedDate(clickedDate, 'mysql')})
    .then(res => {
      if (res.data.length > 0){
        setClickedDate(getClickedDate(clickedDate, 'mysql'));

        setExistingNapStart(res.data[0].napStartTime ? res.data[0].napStartTime : '');
        setExistingNapEnd(res.data[0].napEndTime ? res.data[0].napStartTime : '');
        setSleepAidItem(res.data[0].sleepAidItem ? res.data[0].sleepAidItem : '');
        setSleepAidMg(res.data[0].setSleepAidMg ? res.data[0].setSleepAidMg : '');
        setEnterBedTime(res.data[0].setEnterBedTime ? res.data[0].setEnterBedTime : '');
        setLightsOffTime(res.data[0].setLightsOffTime ? res.data[0].setLightsOffTime : '');
        setTimeToFallAsleep(res.data[0].setTimeToFallAsleep ? res.data[0].setTimeToFallAsleep : '');
        setNumberTimesArousal(res.data[0].setNumberTimesArousal ? res.data[0].setNumberTimesArousal : '');
        setArousalDuration(res.data[0].setArousalDuration ? res.data[0].setArousalDuration : '');
        setMorningWakeTime(res.data[0].setMorningWakeTime ? res.data[0].setMorningWakeTime : '');
        setExitBedTime(res.data[0].setExitBedTime ? res.data[0].setExitBedTime : '');
        setMinutesEarlyWoke(res.data[0].setMinutesEarlyWoke ? res.data[0].setMinutesEarlyWoke : '');
        setQualityRating(res.data[0].setQualityRating ? res.data[0].setQualityRating : '');

        setExistingDataAlert(true);
      } else {
        const dataFuncs = [setExistingNapStart, setExistingNapEnd, setSleepAidItem, setSleepAidMg, setEnterBedTime, setLightsOffTime, setTimeToFallAsleep, setNumberTimesArousal, setArousalDuration, setMorningWakeTime, setExitBedTime, setMinutesEarlyWoke, setQualityRating];

        for (let i = 0; i < dataFuncs.length; i++){
          dataFuncs[i]('');
        }
        
        setExistingDataAlert(false);
      }
    })
    //check axios for existing data 
  } 
  const handleDataSubmit = () => {
    axios.post(urlUploadData, {
      clickedDate: clickedDate,
      existingNapStart: existingNapStart,
      existingNapEnd: existingNapEnd,
      sleepAidItem: sleepAidItem,
      sleepAidMg: sleepAidMg,
      enterBedTime: enterBedTime,
      lightsOffTime: lightsOffTime,
      timeToFallAsleep: timeToFallAsleep,
      numberTimesArousal: numberTimesArousal,
      arousalDuration: arousalDuration,
      morningWakeTime: morningWakeTime,
      exitBedTime: exitBedTime,
      minutesEarlyWoke: minutesEarlyWoke,
      qualityRating: qualityRating
    })
  };
  let dateHeading;
  let dateClickedYear;
  if (date){
    dateHeading = getClickedDate(date);
    dateClickedYear = date.getFullYear();
  }
  const handleFormInput = (e) => {
    c('e id', e.target.getAttribute('id_val'));
    c('existnap value', e.target.value);
    if (e.target.getAttribute('id_val') === 'nap-start-time') {
      setExistingNapStart(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'nap-end-time') {
      setExistingNapEnd(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'sleep-aid-item'){
      setSleepAidItem(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'sleep-aid-mg'){
      setSleepAidMg(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'enter-bed-time'){
      setEnterBedTime(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'lights-off-time'){
      setLightsOffTime(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'time-to-fall-asleep'){
      setTimeToFallAsleep(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'number-times-arousal'){
      setNumberTimesArousal(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'arousal-duration'){
      setArousalDuration(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'morning-wake-time'){
      setMorningWakeTime(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'exit-bed-time'){
      setExitBedTime(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'minutes-early-woke'){
      setMinutesEarlyWoke(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'quality-rating'){
      setQualityRating(e.target.value);
    }
  }
  const curYear = (new Date()).getFullYear();
  return(
    <>
      <Container className="add-data">
        <h1>Add Data</h1>
        <h2>Pick a Date to Add Data</h2> 
        <Calendar
          onChange={onChange}
          value={value}
          view={'month'}
          onClickDay={(value, event) => {
            // console.log('New date is: ', value)
            // c('valueonly', value);
            setDate(value);
            checkExistingData(value);
          }}
        />
        {date && 
          <>
            <h2>Adding data for <strong>{dateHeading}</strong>: </h2>
            {(dateClickedYear < curYear || dateClickedYear > curYear) && 
              <Alert variant="warning">The day you clicked is not in the current year of {curYear}. If you're lost, click the chevron symbols (« or ») at the top of the calendar to scroll between years.</Alert>
            }
            {existingDataAlert && 
              <Alert variant="success">You have already submitted data for {dateHeading}. Your previous data has been autofilled below. You can resubmit if you would like to add or change data.</Alert>
            }
            <Form className="add-data-form">
              <Form.Label>1a. Yesterday I started my first nap at ___. (Example: <span className="add-data-form-example">2:30 PM</span>)</Form.Label>
              <Form.Control 
                id_val="nap-start-time"
                type="time" 
                className={existingNapStart !== '' && "existing-data"}
                value={existingNapStart} 
                placeholder={existingNapStart} 
                onChange={handleFormInput}
              />
              <Form.Label>1a. Yesterday I ended my last nap at ___. (Example: <span className="add-data-form-example">3:15 PM</span>)</Form.Label>
              <Form.Control 
                id_val="nap-end-time"
                className={existingNapEnd !== '' && "existing-data"}
                type="time" 
                value={existingNapEnd}
                onChange={handleFormInput}
              />
              <Form.Label>2a. Last night I took ___ as a sleep aid. (Example: <span className="add-data-form-example">Ambien</span>)</Form.Label>
              <Form.Control 
                id_val="sleep-aid-item"
                className={sleepAidItem !== '' && "existing-data"}
                type="text" 
                value={sleepAidItem}
                onChange={handleFormInput}
              />
              <Form.Label>2b. The amount of sleep aid I took last night was ___ mg/ounces (mg for medication / ounces for alcohol). (Example: <span className="add-data-form-example">5</span>)</Form.Label>
              <Form.Control 
                id_val="sleep-aid-mg"
                className={sleepAidMg !== '' && "existing-data"}
                type="number" 
                value={sleepAidMg}
                onChange={handleFormInput}
              />
              <Form.Label>3a. Last night I got into bed at ___.  (Example: <span className="add-data-form-example">11:00 PM</span>)</Form.Label>
              <Form.Control 
                id_val="enter-bed-time"
                className={enterBedTime !== '' && "existing-data"}
                type="time" 
                value={enterBedTime}
                onChange={handleFormInput}
              />
              <Form.Label>3b. Last night I turned off the lights and tried to fall asleep at ___. (Example: <span className="add-data-form-example">11:40 PM</span>)</Form.Label>
              <Form.Control 
                id_val="lights-off-time"
                className={lightsOffTime !== '' && "existing-data"}
                type="time" 
                value={lightsOffTime}
                onChange={handleFormInput}
              />
              <Form.Label>4. After I turned off the lights, it took me about ___ minutes to fall asleep. (Example: <span className="add-data-form-example">75 min</span>)</Form.Label>
              <Form.Control 
                id_val="time-to-fall-asleep"
                className={timeToFallAsleep !== '' && "existing-data"}
                type="number" 
                value={timeToFallAsleep}
                onChange={handleFormInput}
              />
              <Form.Label>5. I woke up from sleep ___ times. (Do not count when you finally woke up here.) (Example: <span className="add-data-form-example">3 times</span>)</Form.Label>
              <Form.Control 
                id_val="number-times-arousal"
                className={numberTimesArousal !== '' && "existing-data"}
                type="number" 
                value={numberTimesArousal}
                onChange={handleFormInput}
              />
              <Form.Label>6. My arousals lasted ___ minutes. (List each arousal seperately.) (Example: <span className="add-data-form-example">25 min, 40 min, 10 min</span>)</Form.Label>
              <Form.Control 
                id_val="arousal-duration"
                className={arousalDuration !== '' && "existing-data"}
                type="number" 
                value={arousalDuration}
                onChange={handleFormInput}
              />
              <Form.Label>7. Today I woke up at ___. (Note: this is when you finally woke up.) (Example: <span className="add-data-form-example">6:30 AM</span>)</Form.Label>
              <Form.Control 
                id_val="morning-wake-time"
                className={morningWakeTime !== '' && "existing-data"}
                type="time" 
                value={morningWakeTime}
                onChange={handleFormInput}
              />
              <Form.Label>8. Today I got out of bed for the day at ___. (Example: <span className="add-data-form-example">06:45 AM</span>)</Form.Label>
              <Form.Control 
                id_val="exit-bed-time"
                className={exitBedTime !== '' && "existing-data"}
                type="time" 
                value={exitBedTime}
                onChange={handleFormInput}
              />
              <Form.Label>9. Today I woke up ___ minutes earlier than I wanted to. (Example: <span className="add-data-form-example">0</span>)</Form.Label>
              <Form.Control 
                id_val="minutes-early-woke"
                className={minutesEarlyWoke !== '' && "existing-data"}
                type="number" 
                value={minutesEarlyWoke}
                onChange={handleFormInput}
              />
              <Form.Label>
                10.  I would rate the quality of last night's sleep as 1 = very poor, 2 = poor, 3 = fair, 4 = good, or 5 = excellent. (Example: <span className="add-data-form-example">3</span>)</Form.Label>
              <Form.Control 
                id_val="quality-rating"
                className={qualityRating !== '' && "existing-data"}
                type="number" 
                value={qualityRating}
                onChange={handleFormInput}
              />
            </Form>
            <Button onClick={handleDataSubmit}>Submit</Button>
          </>
        }
      </Container>
    </>
  );
}

export default AddData;