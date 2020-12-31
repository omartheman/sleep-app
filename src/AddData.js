import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import './AddData.scss';
import axios from 'axios';

const url = 'http://localhost:4000/sleep/api/upload-data'

class AddData extends React.Component {

  handleDataSubmit(){
    console.log('datadata')
    axios.post(url, {test: 'testvalue'})
  }
  render(){
    return(
      <>
        <Container>
          <h1>Add Data</h1>
          <Form className="add-data-form">
            <Form.Label>Nap Start Time</Form.Label>
            <Form.Control type="time"></Form.Control>
            <Form.Label>Nap End Time</Form.Label>
            <Form.Control type="time"></Form.Control>
          </Form>
          <Button onClick={this.handleDataSubmit}>Submit</Button>
        </Container>
      </>
    );
  }
}

export default AddData;