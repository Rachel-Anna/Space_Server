const express = require('express');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');

app.use(cors());

const getCoordinates = (req, res) => {
    fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
}

const getISSPassTimes = (req, res) => {
  console.log(`this is the lat${req.query.lat}`);
  fetch(`http://api.open-notify.org/iss-pass.json?lat=${req.query.lat}&lon=${req.query.lon}`)
  .then(response => response.json())
  .then(data => {
    const DurationAndTime = {
      duration: Math.round(data.response[0].duration/60), 
      time: new Date(Number(data.response[0].risetime*1000))
    };
    console.log(DurationAndTime);
    res.json(DurationAndTime) 
  });
  }



app.get('/iss-now', getCoordinates);
app.get('/iss-pass', getISSPassTimes);

app.listen(3001, () => { console.log(`App is running on port 3001`) });
