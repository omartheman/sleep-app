const mode =

"developmentOmar";
/*
"productionNatalie";
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
  corsOrigin = 'http://localhost:3000';
  netServForMobileReactDev = 'http://192.168.1.88:3000';
}

app.use(express.static(__dirname + '../..'));
app.use(cors({
  origin:[
    corsOrigin,
    netServForMobileReactDev,
    'http://192.168.1.87:3000',
    'http://192.168.1.254'
  ],
  methods:['GET','POST', 'DELETE'],
  credentials: true 
}));// enable set cookie


app.post(`/sleep/api/check-existing-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/check-existing-data"');
  const sql = `
  SELECT * FROM sleep_data WHERE date = ?
  `;
  connection.query(sql, [req.body.clickedDate], (err, result) => {
    if (err) throw err; 
    console.log('result: ', result);
    res.send(result);
  })
  console.log(req.body.clickedDate)
})

app.post(`/sleep/api/get-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/upload-data"');
  const sql = `
  SELECT * FROM sleep_data ORDER BY date;
  `;
  connection.query(sql, (err, result) => {
    console.log(result);
    res.send(result);
  });
})

app.post(`/sleep/api/upload-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/upload-data"');
  c('body', req.body)
  const sql = `
    
  `;
  connection.query(sql)
  res.send('This is res.send from "/sleep/api/upload-data"')
})

app.get(`/sleep/api/`, (req, res) => {
  res.send('Its working!Omar')
  console.log('Its working!Omar')
})
// ===============================================================

const path = require('path');
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../recipeapp')));

const port = process.env.PORT || 4000 || 27016 || 27015 || 27017;

app.listen(port, process.env.IP, function(){
  console.log(`Server is running on port ${port}`);
});

function c(itemText, item){
  console.log(itemText, item);
}