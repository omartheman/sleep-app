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
import { Alert, Button, Container, Col, Row } from 'react-bootstrap';
import TimeToFallAsleepChart from './TimeToFallAsleepChart';
import HomeLoggedOut from './HomeLoggedOut';
import CreateAccount from './CreateAccount';
import CreateAccountSuccess from './CreateAccountSuccess';
import backgroundTop from './landing-background-opt.svg';
import MinutesEarlyWokeChart from './MinutesEarlyWokeChart';
import ArousalDurationChart from './ArousalDurationChart';
import QualityRatingChart from './QualityRatingChart';
import SleepAidItemChart from './SleepAidItemChart';
import {Redirect} from 'react-router-dom';

const urlAuth = `${url}auth`;
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserError, setLoggedinUserError] = useState(null);
  const [nightMode, setNightMode] = useState(true);
  const [range, setRange] = useState(30);
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
    setLoggedInUser(newLoggedInUser);
  }
  const handleLoginSubmit = (e, username, password) => {
    c('handling login submit')
    e.preventDefault();
    axios.post(urlAuth,     
      {
        username: username, 
        password: password 
      }
    )
    .then(res => {
      c('axios response to post user info', res)
      if (res.data.username && res.data.username !== ''){
        setLoggedInUser(res.data.username);
      }
    }).catch(error => {console.log(error)})
    // .then( 
    //   axios.get(urlAuth) 
    //   .then(res => { 
    //     c('logged in user submission data', res.data);
    //     setLoggedInUser(res.data);
    //   }).catch(error => {console.log('Axios error from urlAuth: ', error)})
    // )
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
      setNightMode={setNightMode}
      nightMode={nightMode}
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
        <div className={nightMode && 'container-wrapper-night-mode'}>
          {navbar}
          <CreateAccountSuccess 
            nightMode={nightMode}
            loggedInUser={loggedInUser}
          />
        </div>
      )} />
      <Route path="/sleep/create-account" render={() => (
        <div className={nightMode && 'container-wrapper-night-mode'}>
          {navbar}
          <CreateAccount 
            nightMode={nightMode}
            loggedInUser={loggedInUser}
            setNewLoggedInUser={handleNewLoggedInUser}
          />
        </div>
      )} />
      <Route path="/sleep/add-data">
        <>
          {navbar}
          <div className={`app-container-wrapper ${nightMode && 'app-container-wrapper-night'}`}>
            <div className={nightMode && "add-data-component-wrapper-night"}>
              <AddData 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
              />
            </div>
          </div>
        </>
      </Route>

      
      <Route path="/sleep/overview">
        <div className={`app-charts-container-wrapper ${nightMode && 'app-charts-container-wrapper-night'}`}>
          {navbar}
          {/* {!loggedInUser && <Redirect to="/sleep/home-logged-out" />} */}
          <div className={`app-range-input-container ${nightMode && 'app-range-input-container-night'}`}>
            <label>Show data from up to ___ days ago.</label>
            <input 
              className="mr-3"
              type='number'
              value={range}
              onChange={(e) => {
                setRange(Number(e.target.value));
              }}
            />
            <div>
              <Button className="button-inline" onClick={() => {setRange(7)}}>7</Button>
              <Button className="button-inline" onClick={() => {setRange(15)}}>15</Button>
              <Button className="button-inline" onClick={() => {setRange(30)}}>30</Button>
              <Button className="button-inline" onClick={() => {setRange(60)}}>60</Button>
              <Button className="button-inline" onClick={() => {setRange(180)}}>180</Button>
            </div>
          </div>
          <div className={nightMode && "container-night-mode"}>
            <Alert variant="warning" className="mt-5 ml-3 mr-3">Sample Data Shown. Log In to View Your Own Data</Alert>
          </div>
          <Container fluid className="app-charts-container">
            <div className="ct1">
              <EnterBedTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct2">
              <LightsOffTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct3">
              <TimeToFallAsleepChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct9">
              <MorningWakeTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct8">
              <ExitBedTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct7">
              <MinutesEarlyWokeChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>

            <div className="ct4">
              <SleepAidItemChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct6">
              <ArousalDurationChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
            <div className="ct5">
              <QualityRatingChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>

            <div className="ct10">
              <NapTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
              />
              {(!loggedInUser || loggedInUser === '') && 
                <div className={nightMode && 'container-night-mode'}>
                  <h3 className="text-center">(Sample Data)</h3>
                </div>
              }
            </div>
          </Container>
        </div>
      </Route>
      <Route path="/sleep">
        <>
          <div className="home-logged-out-section-1-background-color">
          </div>
          <div className="home-logged-out-section-1-background-mountains">
          </div>
          {navbar}
          <HomeLoggedOut />
        </>
      </Route>
      <Route path="/sleep/home-logged-out" render={() => (
        <>
          <div className="home-logged-out-section-1-background"
          style={{backgroundImage: `url(${backgroundTop})`}}
          ></div>
          {navbar}
          <HomeLoggedOut />
        </>
      )} />
    </Switch>
  )
}

export default App;