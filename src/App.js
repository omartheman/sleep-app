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
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post(urlAuth,     
      {
        username: username, 
        password: password 
      }
    )
    .then(response => {
    }).catch(error => {console.log(error)})
    .then( 
      axios.get(urlAuth) 
      .then(res => { 
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
          <CreateAccount 
            loggedInUser={loggedInUser}
            setNewLoggedInUser={handleNewLoggedInUser}
          />
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
          <div className={nightMode && "add-data-component-wrapper-night"}>
            <AddData 
              nightMode={nightMode}
              loggedInUser={loggedInUser}
            />
          </div>
        </>
      </Route>
      <Route path="/sleep">
        <div className={`app-charts-container-wrapper ${nightMode && 'app-charts-container-wrapper-night'}`}>
          {navbar}
          {/* {!loggedInUser && <Redirect to="/sleep/home-logged-out" />} */}
          <div className={`app-range-input-container ${nightMode && 'app-range-input-container-night'}`}>
            <label>Show data from up to ___ days ago.</label>
            <input 
              type='number'
              value={range}
              onChange={(e) => {
                console.log('range', range);
                setRange(Number(e.target.value));
              }}
            />
          </div>
          <Container fluid className="app-charts-container">
            <div className="ct1">
              <EnterBedTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct2">
              <LightsOffTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct3">
              <TimeToFallAsleepChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct9">
              <MorningWakeTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct8">
              <ExitBedTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct7">
              <MinutesEarlyWokeChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>

            <div className="ct4">
              <SleepAidItemChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct6">
              <ArousalDurationChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
            <div className="ct5">
              <QualityRatingChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>

            <div className="ct10">
              <NapTimesChart 
                nightMode={nightMode}
                loggedInUser={loggedInUser}
                range={range}
                />
            </div>
          </Container>
        </div>
      </Route>
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