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

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const id = uuidv4();
  
  const newUser = {
    _id: id,
    username: username
  };

  usersArr.push(newUser);
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
  const myUser = usersArr.find(obj => obj['_id'] === id);
  const updatedUser = {...myUser, ...newExercise};
  console.log(updatedUser);
  res.json(updatedUser);
});

app.get('/api/users', function(req, res) {
  res.json(usersArr);
});

app.get('/api/users/:_id/exercises', function(req, res) {
  res.json(usersArr);
});

app.get('/api/users/:_id/logs', function(req, res) {
  res.json(usersArr);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
