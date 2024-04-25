// npm index.js to run
// ctr+c to stop
// on gitpod npm install uuid, npm install express
// on browser: http://localhost:3000/
// console.log() for debugging will print on terminal

const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let usersArr = [];
let logsArr = [];

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const id = uuidv4();
  
  const newUser = {
    _id: id,
    username: username
  };

  usersArr.push(newUser);
  logsArr.push({...newUser, count: 0, log: []});

  res.json(newUser);
});


var myLog = [];
app.post('/api/users/:_id/exercises', (req, res) => {
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  const id = req.params._id;
  var date = req.body.date;
  
  if (!date) {
    date = new Date().toDateString()
  } else {
    date = new Date(date).toDateString();
  }
  
  const newExercise = {
    date: date,
    duration: duration,
    description: description    
  };

  // find current user by id
  const myUser = usersArr.find(obj => obj['_id'] === id);
 
  // find the user's log
  const myUserLog = logsArr.find(obj => obj['_id'] === id);

  myUserLog.log.push(newExercise);
  myUserLog.count++;
  
  console.dir(logsArr, {depth: null});
  const updatedUser = {...myUser, ...newExercise};
  res.json(updatedUser);
});

app.get('/api/users', function(req, res) {
  res.json(usersArr);
});

app.get('/api/users/:_id/logs', function(req, res) {
  const {from, to, limit} = req.query;
  const id = req.params._id;

  let myUserLog = logsArr.find(obj => obj['_id'] === id);
  let exLogs = myUserLog.log;
  let amount = 0;

  if (from) {
    const fromDate = new Date(from).toDateString();
    exLogs = exLogs.filter(exLog => {
      const logDate = new Date(exLog.date).toDateString();
      return (logDate >= fromDate);
  })};
  if (to) {
    const toDate = new Date(to).toDateString();
    exLogs = exLogs.filter(exLog => {
      const logDate = new Date(exLog.date).toDateString();
      return (logDate <= toDate);
  })};

  if (limit) {
    // console.log("limit", limit);
    exLogs = exLogs.slice(0, limit);
  }
  res.json({
    _id: id,
    username: myUserLog.username,
    count: exLogs.length,
    log: exLogs
  })
});


/*app.get('/api/users/:_id/logs', function(req, res) {
  const id = req.params._id;
  let myUserLog = logsArr.find(obj => obj['_id'] === id);
  res.json(myUserLog);
});
*/

/*
app.get('/api/users/:_id/logs', function(req, res) {
  const id = req.params._id;
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  let myUserLog = logsArr.find(obj => obj['_id'] === id);
  let exLogs = myUserLog.log;
  let filteredLogs;
  let amount = 0;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    filteredLogs = exLogs.filter(exLog => {
      const logDate = new Date(exLog.date);
      //console.log("from", fromDate, "to", toDate, "log", logDate);
      return (logDate >= fromDate && logDate <= toDate);
    });
  } else if (limit) {
    // console.log("limit", limit);
    filteredLogs = exLogs.slice(0, limit);
  } else {
    filteredLogs = exLogs;
  }

  amount = filteredLogs.length;
  myUserLog.log = filteredLogs;
  myUserLog.count = amount;
  console.log(myUserLog, "the filtered myUserLog");
  res.json(myUserLog);
});
*/

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
