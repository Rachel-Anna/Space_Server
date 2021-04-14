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


const getTimeUntil = (nextRiseTime) => {
  if (nextRiseTime == null) return "error getting risetime" 
  
  let dateNow = new Date();
  let timeDifferenceInDecimal = (nextRiseTime - dateNow)/1000/60/60
  let hours = Math.floor(timeDifferenceInDecimal);
  let hoursText = hours > 1 ? "hours" : "hour";
  let minutes = Math.round((timeDifferenceInDecimal % Math.floor(timeDifferenceInDecimal))*60) || Math.round(timeDifferenceInDecimal*60);
  let minutesText = minutes > 1 ? "minutes" : "minute";

  //if ETA greater than 1 hour and x amount of mins return this
  if (timeDifferenceInDecimal > 1 && minutes) return `ETA in ${hours} ${hoursText} and ${minutes} ${minutesText}`
  
  //if ETA exactly one hour
  if (timeDifferenceInDecimal && !minutes) return `ETA in ${hours} ${hoursText}`
    
  //if ETA under an hour
  if (timeDifferenceInDecimal < 1 && minutes) return `ETA in ${minutes} ${minutesText}`

  //if ETA imminent
  if (timeDifferenceInDecimal < 1 && !minutes) return "Look up, you can see it now!"
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
    res.json(DurationAndTime) 
  });
  }



app.get('/iss-now', getCoordinates);
app.get('/iss-pass', getISSPassTimes);

app.listen(3001, () => { console.log(`App is running on port 3001`) });
