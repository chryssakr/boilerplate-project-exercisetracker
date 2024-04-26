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

  if (from) {
    const fromDate = new Date(from);
    exLogs = exLogs.filter(exLog => {
      const logDate = new Date(exLog.date);
      return (logDate >= fromDate);
  })};
  if (to) {
    const toDate = new Date(to);
    exLogs = exLogs.filter(exLog => {
      const logDate = new Date(exLog.date);
      return (logDate <= toDate);
  })};

  if (limit) {
    console.log("limit", limit);
    exLogs = exLogs.slice(0, limit);
    console.log("exlogs", exLogs);
  }
  res.json({
    _id: id,
    username: myUserLog.username,
    count: exLogs.length,
    log: exLogs
  })
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
