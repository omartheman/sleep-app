import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Calendar from 'react-calendar';
import './AddData.scss';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import c from './global_items';

const url = 'http://localhost:4000/sleep/api/upload-data';

function AddData () {
  const [value, onChange] = useState(new Date());
  const handleDataSubmit = () => {
    console.log('datadata')
    axios.post(url, {test: 'testvalue'})
  }
  return(
    <>
      <Container>
        <h1>Add Data</h1>
        <h2>Pick a Date to Add Data</h2>
        <Calendar
          onChange={onChange}
          value={value}
          onClickDay={(value, event) => {
            console.log('New date is: ', value)
            c('valueonly', value);
          }}
        />
        <Form className="add-data-form">
          <Form.Label>Nap Start Time</Form.Label>
          <Form.Control type="time"></Form.Control>
          <Form.Label>Nap End Time</Form.Label>
          <Form.Control type="time"></Form.Control>
        </Form>
        <Button onClick={handleDataSubmit}>Submit</Button>
      </Container>
    </>
  );
}

export default AddData;