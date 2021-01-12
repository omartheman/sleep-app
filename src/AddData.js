import { useState, useEffect } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { Calendar } from 'react-calendar';
import './AddData.scss';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import {c, getClickedDate, url} from './global_items';

const urlCheckExistingData = `${url}check-existing-data`;
const urlUploadData = `${url}upload-data`;

axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.withCredentials = true;

function AddData (props) {
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
  const [checkExistingDataCompleted, setCheckExistingDataCompleted] = useState(false);

  useEffect(() => {
    let d = new Date();
    setDate(d);
    checkExistingData(d);
  }, [props]);

  const checkExistingData = (clickedDate) => {
    setCheckExistingDataCompleted(false);
    c('checking existing data')
    c('user',props.loggedInUser)
    c('props', props)
    if (!props.loggedInUser){return};
    c('didnt return')
    axios.post(urlCheckExistingData, {
      clickedDate: getClickedDate(clickedDate, 'mysql'),
      user: props.loggedInUser
    })
    .then(res => {
      setClickedDate(getClickedDate(clickedDate, 'mysql'));
      if (res.data.length > 0){

        setExistingNapStart(res.data[0].napStartTime ? res.data[0].napStartTime : '');
        setExistingNapEnd(res.data[0].napEndTime ? res.data[0].napEndTime : '');
        setSleepAidItem(res.data[0].sleepAidItem ? res.data[0].sleepAidItem : '');
        setSleepAidMg(res.data[0].sleepAidMg ? res.data[0].sleepAidMg : '');
        setEnterBedTime(res.data[0].enterBedTime ? res.data[0].enterBedTime : '');
        setLightsOffTime(res.data[0].lightsOffTime ? res.data[0].lightsOffTime : '');
        setTimeToFallAsleep(res.data[0].timeToFallAsleep ? res.data[0].timeToFallAsleep : '');
        setNumberTimesArousal(res.data[0].numberTimesArousal ? res.data[0].numberTimesArousal : '');
        setArousalDuration(res.data[0].arousalDuration ? res.data[0].arousalDuration : '');
        setMorningWakeTime(res.data[0].morningWakeTime ? res.data[0].morningWakeTime : '');
        setExitBedTime(res.data[0].exitBedTime ? res.data[0].exitBedTime : '');
        setMinutesEarlyWoke(res.data[0].minutesEarlyWoke ? res.data[0].minutesEarlyWoke : '');
        setQualityRating(res.data[0].qualityRating ? res.data[0].qualityRating : '');

        setExistingDataAlert(true);
      } else {
        const dataFuncs = [setExistingNapStart, setExistingNapEnd, setSleepAidItem, setSleepAidMg, setEnterBedTime, setLightsOffTime, setTimeToFallAsleep, setNumberTimesArousal, setArousalDuration, setMorningWakeTime, setExitBedTime, setMinutesEarlyWoke, setQualityRating];
        for (let i = 0; i < dataFuncs.length; i++){
          dataFuncs[i]('');
        }
        setExistingDataAlert(false);
      }
      setCheckExistingDataCompleted(true);
    })
  } 
  const handleDataSubmit = () => {
    axios.post(urlUploadData, {
      //Ternarys were set to not give a value for SQL when there is none. Helps with creating graphs to skip data.
      user: props.loggedInUser,
      date: clickedDate === '' ? null : clickedDate,
      napStartTime: existingNapStart === '' ? null : existingNapStart,
      napEndTime: existingNapEnd === '' ? null : existingNapEnd,
      sleepAidItem: sleepAidItem === '' ? null : sleepAidItem,
      sleepAidMg: sleepAidMg === '' ? null : sleepAidMg,
      enterBedTime: enterBedTime === '' ? null : enterBedTime,
      lightsOffTime: lightsOffTime === '' ? null : lightsOffTime,
      timeToFallAsleep: timeToFallAsleep === '' ? null : timeToFallAsleep,
      numberTimesArousal: numberTimesArousal === '' ? null : numberTimesArousal,
      arousalDuration: arousalDuration === '' ? null : arousalDuration,
      morningWakeTime: morningWakeTime === '' ? null : morningWakeTime,
      exitBedTime: exitBedTime === '' ? null : exitBedTime,
      minutesEarlyWoke: minutesEarlyWoke === '' ? null : minutesEarlyWoke,
      qualityRating: qualityRating === '' ? null : qualityRating
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
      c('timetosleep', typeof e.target.value)
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
      c('minutesEarlyWoke', typeof e.target.value)
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
        <div className="add-data-calendar-container">
          <Calendar
            onChange={onChange}
            value={value}
            view={'month'}
            onClickDay={(value, event) => {
              // console.log('New date is: ', value)
              // c('valueonly', value);
              setDate(value);
              c('date value', value)
              checkExistingData(value);
            }}
          />
        </div>
        {date && 
          <>
            <h2>Adding data for {getClickedDate(date) === getClickedDate((new Date())) && 'today: '}<strong>{dateHeading}</strong>: </h2>
            {checkExistingDataCompleted ?
              <>
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
                  <Form.Label>6. My arousals lasted ___ minutes. (List each arousal seperately. You can simply list the arousals as numbers seperated by spaces) (Example for arousals of 25min, 40min, and 10min: <span className="add-data-form-example">25 40 10</span>)</Form.Label>
                  <Form.Control 
                    id_val="arousal-duration"
                    className={arousalDuration !== '' && "existing-data"}
                    type="text" 
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
                <Button className="add-data-submit-button" onClick={handleDataSubmit}>Submit</Button>
              </>
            : 
              <Spinner variant="success" animation="border" role="status" id="spinner-centered" className="spinner-centered"><span className="sr-only">Loading...</span></Spinner>
            }
          </>
        }
      </Container>
    </>
    );
}

export default AddData;