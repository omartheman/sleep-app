import { useState, useEffect } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { Calendar } from 'react-calendar';
import './AddData.scss';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import {c, getClickedDate, url} from './global_items';

const urlCheckExistingData = `${url}check-existing-data`;

axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.withCredentials = true;

function AddData () {
  const [value, onChange] = useState(new Date());
  const [date, setDate] = useState(null);
  const [existingNapStart, setExistingNapStart] = useState('');
  const [existingNapEnd, setExistingNapEnd] = useState('');
  const [existingDataAlert, setExistingDataAlert] = useState(false);
  const checkExistingData = (clickedDate) => {
    axios.post(urlCheckExistingData, {clickedDate: getClickedDate(clickedDate, 'mysql')})
    .then(res => {
      if (res.data.length > 0){
        setExistingNapStart(res.data[0].napStartTime);
        setExistingNapEnd(res.data[0].napEndTime);
        setExistingDataAlert(true);
      } else {
        setExistingNapStart('');
        setExistingNapEnd('');
        setExistingDataAlert(false);
      }
    })
    //check axios for existing data 
  } 
  const handleFormInput = (e) => {
    c('e id', e.target.getAttribute('id_val'))
    c('existnap value', e.target.value)
    if (e.target.getAttribute('id_val') === 'nap-start-time') {
      setExistingNapStart(e.target.value);
    } else if (e.target.getAttribute('id_val') === 'nap-end-time') {
      setExistingNapEnd(e.target.value);
    }

  }
  const handleDataSubmit = () => {
    axios.post(url, {test: 'testvalue'})
  };
  let dateHeading;
  let dateClickedYear;
  if (date){
    dateHeading = getClickedDate(date);
    dateClickedYear = date.getFullYear();
  }
  const curYear = (new Date()).getFullYear();
  return(
    <>
      <Container>
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
              <Form.Label>Nap Start Time</Form.Label>
              <Form.Control 
                id_val="nap-start-time"
                type="time" 
                className={existingNapStart !== '' && "existing-data"}
                value={existingNapStart} 
                placeholder={existingNapStart} 
                onChange={handleFormInput}
              />
              <Form.Label>Nap End Time</Form.Label>
              <Form.Control 
                id_val="nap-end-time"
                className={existingNapEnd !== '' && "existing-data"}
                type="time" 
                value={existingNapEnd}
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