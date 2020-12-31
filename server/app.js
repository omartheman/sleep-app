const mode =

"developmentOmar";
/*
"productionBritt";
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
let imageUploadPath;
let netServForMobileReactDev;
if (mode === 'productionBritt') {
  connection = mysql.createConnection({
    host: 'localhost', 
    user: 'britxbtx_omar2',
    password: '3yeDroplets!',
    database: 'britxbtx_recipe_app_test'
  });
  corsOrigin = 'https://brittanyjewellneal.com/recipeapp';
  imageUploadPath = '/home/britxbtx/public_html/uploaded_files';
} else if (mode === 'developmentOmar') {
  connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '3yeDroplets!',
    database: 'sleep_app'
  });
  corsOrigin = 'http://localhost:3000';
  netServForMobileReactDev = 'http://192.168.1.88:3000';
  imageUploadPath = 'C:/Users/HP EliteBook 8470p/Documents/Coding/recipe-app/uploaded_files';
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

app.post(`/sleep/api/get-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/upload-data"');
  const sql = `
    SELECT * FROM sleep_data;
  `;
  connection.query(sql, (err, result) => {
    console.log(result);
    res.send(result);
  });
})

app.post(`/sleep/api/upload-data`, (req, res) => {
  console.log('Got a POST request to "/sleep/api/upload-data"');
  res.send('This is res.send from "/sleep/api/upload-data"')
})

// ===============================================================

const path = require('path');
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../recipeapp')));

const port = process.env.PORT || 4000 || 27016 || 27015 || 27017;

app.listen(port, process.env.IP, function(){
  console.log(`Server is running on port ${port}`);
});