import { useState, useEffect } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { Calendar } from 'react-calendar';
import './AddData.scss';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import {c, longDateString} from './global_items';

const url = 'http://localhost:4000/sleep/api/upload-data';

function AddData () {
  const [value, onChange] = useState(new Date());
  const [date, setDate] = useState(null);
  useEffect(() => {
    c('date', date)
  })
  const handleDataSubmit = () => {
    console.log('datadata')
    axios.post(url, {test: 'testvalue'})
  }
  let dateHeading;
  let dateClickedYear;
  if (date){
    dateHeading = longDateString(date);
    dateClickedYear = date.getFullYear();
  }
  const curYear = (new Date()).getFullYear();
  c('year', curYear)
  c('clickedyear', dateClickedYear)
  return(
    <>
      <Container>
        <h1>Add Data</h1>
        <h2>Pick a Date to Add Data</h2> 
        <Calendar
          onChange={onChange}
          value={value}
          onClickDay={(value, event) => {
            // console.log('New date is: ', value)
            // c('valueonly', value);
            setDate(value);
          }}
        />
        {date && 
          <>
            <h2>{dateHeading}</h2>
            {(dateClickedYear < curYear || dateClickedYear > curYear) && 
              <Alert variant="warning">You are no longer in the current year of {curYear}</Alert>
            }
            <Form className="add-data-form">
              <Form.Label>Nap Start Time</Form.Label>
              <Form.Control type="time"></Form.Control>
              <Form.Label>Nap End Time</Form.Label>
              <Form.Control type="time"></Form.Control>
            </Form>
            <Button onClick={handleDataSubmit}>Submit</Button>
          </>
        }
      </Container>
    </>
  );
}

export default AddData;