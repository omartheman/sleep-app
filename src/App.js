import './App.css';
import NapTimesChart from './NapTimesChart';
import {useEffect, useState} from 'react';
import axios from 'axios';
import NavbarContainer from './NavbarContainer';
import AddData from './AddData';
import './App.css';
import './App.scss';
import React from 'react';
import {Switch, Route} from 'react-router';
import {url, c} from './global_items';
import EnterBedTimesChart from './EnterBedTimesChart';
import MorningWakeTimesChart from './MorningWakeTimesChart';
import LightsOffTimesChart from './LightsOffTimesChart';
import ExitBedTimesChart from './ExitBedTimesChart';
import { Container, Col, Row } from 'react-bootstrap';
import TimeToFallAsleepChart from './TimeToFallAsleepChart';
import HomeLoggedOut from './HomeLoggedOut';
import CreateAccount from './CreateAccount';
import CreateAccountSuccess from './CreateAccountSuccess';
import backgroundTop from './landing-background-opt.svg';
import MinutesEarlyWokeChart from './MinutesEarlyWokeChart';
import ArousalDurationChart from './ArousalDurationChart';
import QualityRatingChart from './QualityRatingChart';
import SleepAidItemChart from './SleepAidItemChart';

const urlAuth = `${url}auth`;
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserError, setLoggedinUserError] = useState(null);
  // const [intervalId, setIntervalId] = useState(null);
  useEffect(() => {
    axios.get(urlAuth) 
    .then(res => { 
      setLoggedInUser(res.data);
    }).catch(error => {console.log(error)})
    // const intervalId = setInterval(checkLoggedIn, 2000);
    // setIntervalId(intervalId);
  }, [])
  
  const checkLoggedIn = () => {
    axios.get(urlAuth) 
    .then(res => { 
      console.log('loggedInUser: ', res.data);
      setLoggedInUser(res.data);
    }).catch(error => {
      console.log(error)
      console.log('Axios error. User logged out.')
      if (loggedInUserError === false) {
        console.log('Axios error. User logged out.')
        if (url !== 'http://localhost:4000/recipeapp/recipeapp-server/'){
          alert("There was an error with the server. 🤬 Alert the Webmaster!");
        }
        setLoggedinUserError(true);
      }
      setLoggedInUser(null);
    })
  }
  const handleNewLoggedInUser = (newLoggedInUser) => {
    console.log('new logged in user: ',newLoggedInUser)
    setLoggedInUser(newLoggedInUser);
  }
  const handleLoginSubmit = (e) => {
    console.log('login clicked')
    e.preventDefault();
    console.log('error not here')
    axios.post(urlAuth,     
      {
        username: username, 
        password: password 
      }
    )
    .then(response => {
      console.log('axios response: ', response)
    }).catch(error => {console.log(error)})
    .then( 
      axios.get(urlAuth) 
      .then(res => { 
        console.log(res);
        setLoggedInUser(res.data);
      }).catch(error => {console.log('Axios error from urlAuth: ', error)})
    )
  }
  const handleLoginFormChange = (eTargetAttrVal, item) => {
    console.log('loginformchage')
    if (item === 'username'){
      setUsername(eTargetAttrVal);
    } else if (item === 'password') {
      setPassword(eTargetAttrVal);
    }
  }
  const handleLogout = () => {
    setLoggedInUser(null);
  }
  const navbar = 
    <NavbarContainer
      loginSubmit={handleLoginSubmit}
      onLoginFormChange={handleLoginFormChange}
      loggedInUser={loggedInUser}
      onLogout={handleLogout}
      username={username}
      password={password}
    />
  ;
  return(
    <Switch>
      <Route path="/sleep/create-account-success" render={() => (
        <>
          {navbar}
          <CreateAccountSuccess 
            loggedInUser={loggedInUser}
          />
        </>
      )} />
      <Route path="/sleep/create-account" render={() => (
        <>
          {navbar}
          <CreateAccount />
        </>
      )} />
      <Route path="/sleep/home-logged-out" render={() => (
        <>
          <div className="home-logged-out-section-1-background"
          style={{backgroundImage: `url(${backgroundTop})`}}
          ></div>
          {navbar}
          <HomeLoggedOut />
        </>
      )} />
      <Route path="/sleep/add-data">
        <>
          {navbar}
          <AddData 
            loggedInUser={loggedInUser}
          />
        </>
      </Route>
      <Route path="/sleep">
        <>
          {navbar}
          <Container fluid>
            <Row>
              <Col lg>
                <SleepAidItemChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
              <Col lg>
                <QualityRatingChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
              <Col lg>
                <ArousalDurationChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
            </Row>
            <Row>
              <Col lg>
                <MinutesEarlyWokeChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
              <Col lg>
                <TimeToFallAsleepChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
              <Col lg>
                <ExitBedTimesChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
            </Row>
            <Row>
              <Col lg>
                <EnterBedTimesChart 
                  loggedInUser={loggedInUser}
                  />
              </Col>
              <Col lg>
                <LightsOffTimesChart 
                  loggedInUser={loggedInUser}
                  />
              </Col>
              <Col lg>
                <MorningWakeTimesChart 
                  loggedInUser={loggedInUser}
                />
              </Col>
            </Row>
            <NapTimesChart 
              loggedInUser={loggedInUser}
            />
          </Container>
        </>
      </Route>
      <Route path="/recipeapp/create-account-success" render={() => (
        <>
          {navbar}
          {/* <CreateAccountSuccess
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/recipe-upload-success" render={() => (
        <>
          {navbar}
          {/* <RecipeUploadSuccess
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/recipe/:recipeId" render={(props) => (
        <>
          {navbar}
          {/* <RecipePage
            {...props}
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/all-recipes" render={() => (
        <>
          {navbar}
          {/* <AllRecipes
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/myrecipes" render={() => (
        <>
          {navbar}
          {/* <MyRecipes
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/recipe-upload" render={() => (
        <>
          {navbar}
          {/* <RecipeUpload
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/login" render={() => (
        <>
          {navbar}
          {/* <Login 
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
            onLoginFormChange={this.handleLoginFormChange}
            loginSubmit={this.handleLoginSubmit}
            username={username}
            password={password}
          /> */}
        </>
      )} />
      <Route path="/recipeapp/create-account" render={() => (
        <>
          {navbar}
          {/* <CreateAccount
            loggedInUser={loggedInUser}
            onLogout={this.handleLogout}
            onLoginFormChange={this.handleLoginFormChange}
            setNewLoggedInUser={this.handleNewLoggedInUser}
          /> */}
        </>
      )} />
    </Switch>
  )
}

export default App;