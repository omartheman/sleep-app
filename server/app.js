const mode = "developmentOmar";
/*
const mode = "productionNatalie";
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const serverRoute = '/recipeapp/recipeapp-server/';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: '3423sdasdlfj34',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

let corsOrigin;
let connection;
let netServForMobileReactDev;
if (mode === 'productionNatalie') {
  connection = mysql.createConnection({
    host: 'localhost', 
    user: 'omarnaod_admin',
    password: '3yeDroplets!',
    database: 'omarnaod_sleep_app'
  });
  corsOrigin = 'https://omarshishani.com/sleep/';
} else if (mode === 'developmentOmar') {
  connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '3yeDroplets!',
    database: 'sleep_app'
  });
  corsOrigin = 'http://localhost:4000';
  netServForMobileReactDev = 'http://192.168.1.88:4000';
}

app.use(express.static(__dirname + '../..'));
app.use(cors({
  origin:[
    corsOrigin,
    netServForMobileReactDev,
    'http://192.168.1.87:4000',
    'http://192.168.1.254'
  ],
  methods:['GET','POST', 'DELETE'],
  credentials: true 
}));// enable set cookie


app.post(`/sleep/api/check-existing-usernames`, (req, res) => {
  console.log('Got a POST request to /check-existing-usernames.')
  console.log(req.body.username)
  const sql = `SELECT * FROM accounts WHERE username = ?;`;
  connection.query(sql, [req.body.username], (err, result) => {
    if (err) throw err;
    console.log('matched usernames: ',result);
    res.send(result);
  });
});

app.post(`/sleep/api/create-account`, (req, res) => {
  console.log('Create account post working.')
  res.send('Got a POST request to create account.');
  var sql = `INSERT INTO accounts (firstName, lastName, email, username, password)
    VALUES(
      ?,
      ?,
      ?,
      ?,
      ?
  );`;
  connection.query(sql, [
    req.body.firstName, 
    req.body.lastName,
    req.body.email,
    req.body.username,
    req.body.password
  ], function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.get(`/sleep/api/logout`, function(req, res){
  req.session.loggedin = false;
  res.send('Logged out.')
});

app.get(`/sleep/api/auth`, function(req, res){
  if (req.session.loggedin) {
    res.send(req.session.username);
  } 
  res.end();
}); 

app.post(`/sleep/api/auth`, function(req, res) {
  console.log('req.body in post: ', req.body)
  const username = req.body.username;
  const password = req.body.password;
  c('username', username)
  c('password', password)
  if (username && password) {
    connection.query(`SELECT * FROM accounts WHERE username = ? AND password = ?;`, [username, password], function(error, results, fields) {
      if (results.length > 0) {
        console.log('results in app.post', results);
        req.session.loggedin = true;
        req.session.username = username; 
        req.session.page_views++;
        console.log('Logged in user from app.post: ', username);
        res.send({username: username, password: password})
      } else {
        res.send('Incorrect Username and/or Password!');
        req.session.page_views = 1; 
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.post(`/sleep/api/check-existing-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/check-existing-data"');
  c('body for check data', req.body);
  const sql = `
  SELECT * FROM sleep_data WHERE date = ? AND user = ?
  `;
  connection.query(sql, [req.body.clickedDate, req.body.user], (err, result) => {
    if (err) throw err; 
    console.log('result: ', result);
    res.send(result);
  })
  console.log(req.body.clickedDate)
})

app.post(`/sleep/api/get-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/get-data"');
  const sql = `
  SELECT * FROM sleep_data WHERE user = ? ORDER BY date DESC;
  `;
  connection.query(sql, [req.body.user], (err, result) => {
    console.log(result);
    res.send(result);
  });
});

app.post(`/sleep/api/upload-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/upload-data"');
  c('body', req.body)
  if (!req.body.user) {return};
  const sql = `
    SELECT * FROM sleep_data WHERE user = ? AND date = ?;
  `;
  connection.query(sql, [req.body.user, req.body.date], (err, result) => {
    if (err) throw err; 
    let sql;
    let sqlVars;
    //CHECK IF DATE CONTAINS RECORD
    if ( !result.length ){
      //DATE DOES NOT CONTAIN RECORD
      sql = `
        INSERT INTO sleep_data 
        (user, date, napStartTime, napEndTime, sleepAidItem, sleepAidMg, enterBedTime, lightsOffTime, timeToFallAsleep, numberTimesArousal, arousalDuration, morningWakeTime, exitBedTime, minutesEarlyWoke, qualityRating)
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `;
      sqlVars = [req.body.user, req.body.date, req.body.napStartTime, req.body.napEndTime, req.body.sleepAidItem,req.body.sleepAidMg, req.body.enterBedTime, req.body.lightsOffTime, req.body.timeToFallAsleep, req.body.numberTimesArousal, req.body.arousalDuration, req.body.morningWakeTime, req.body.exitBedTime, req.body.minutesEarlyWoke, req.body.qualityRating 
      ];
      c('sql1', sql);
      c('sqlvars', sqlVars)
    } else {
      // DATE DOES CONTAIN RECORD
      sql = `
        UPDATE sleep_data
        SET napStartTime = ?, napEndTime = ?, sleepAidItem = ?, sleepAidMg = ?, enterBedTime = ?, lightsOffTime = ?, timeToFallAsleep = ?, numberTimesArousal = ?, arousalDuration = ?, morningWakeTime = ?, exitBedTime = ?, minutesEarlyWoke = ?, qualityRating = ?
        WHERE user = ? AND date = ?
      `;
      sqlVars = [req.body.napStartTime, req.body.napEndTime, req.body.sleepAidItem, req.body.sleepAidMg, req.body.enterBedTime, req.body.lightsOffTime, req.body.timeToFallAsleep, req.body.numberTimesArousal, req.body.arousalDuration, req.body.morningWakeTime, req.body.exitBedTime, req.body.minutesEarlyWoke, req.body.qualityRating, req.body.user, req.body.date];
      c('sql2', sql);
      c('sqlvars', sqlVars);
    }
    connection.query(sql, sqlVars, (err, result) => {
      if (err) throw err;
      console.log('upload data result: ', result)
    });
    res.send('This is res.send from "/sleep/api/upload-data"')
  })
})

app.get(`/sleep/api/`, (req, res) => {
  res.send('Its working!Omar')
  console.log('Its working!Omar')
})
// ===============================================================
// LINK REACT ROUTER AND EXPRESS APP
// Handles any requests that don't match the ones above
app.get('/sleep*', (req, res) =>{
  res.sendFile(path.join(__dirname + '/../sleep/index.html'));
});

const path = require('path');
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../sleep')));

const port = process.env.PORT || 4000 || 27016 || 27015 || 27017;

app.listen(port, process.env.IP, function(){
  console.log(`Server is running on port ${port}`);
});

function c(itemText, item){
  console.log(itemText, item);
}