const express = require('express');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');

app.use(cors());
let timeFormatter = new Intl.DateTimeFormat([], {dateStyle: "full", timeStyle: "long"}); 

const getCoordinates = (req, res) => {
    fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
}


const getTimeUntil = (nextRiseTime)=> {
  let dateNow = new Date();
  let diffInHoursAndMins = (nextRiseTime - dateNow)/1000/60/60
  console.log(diffInHoursAndMins)
  if (diffInHoursAndMins > 1 /*hour*/) {
    let hours = Math.floor(diffInHoursAndMins);
    let hoursText = hours > 1 ? "hours" : "hour";
    let minutes = Math.round((diffInHoursAndMins % Math.floor(diffInHoursAndMins))*60);
    if (minutes === 0) {
      return `ETA in ${hours} ${hoursText}`
    } else {
      let minutesText = minutes > 1 ? "minutes" : "minute";
      return `ETA in ${hours} ${hoursText} and ${minutes} ${minutesText}`
    }
  } else {
    let minutes = Math.round(diffInHoursAndMins*60);
    if (minutes === 0) {
      return "You can see it now!!"
    } else {
      let minutesText = minutes > 1 ? "minutes" : "minute";
      return `ETA in ${minutes} ${minutesText}`
    }
  }
  
}

const getISSPassTimes = (req, res) => {
  fetch(`http://api.open-notify.org/iss-pass.json?lat=${req.query.lat}&lon=${req.query.lon}`)
  .then(response => response.json())
  .then(data => {
    let nextRiseTime = new Date(data.response[0].risetime*1000);
    const DurationAndTime = {
      duration: Math.round(data.response[0].duration/60), 
      time: timeFormatter.format(nextRiseTime),
      timeUntil: getTimeUntil(nextRiseTime)
    };
    console.log(DurationAndTime);
    res.json(DurationAndTime) 
  });
  }



app.get('/iss-now', getCoordinates);
app.get('/iss-pass', getISSPassTimes);

app.listen(3001, () => { console.log(`App is running on port 3001`) });
