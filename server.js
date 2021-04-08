const express = require('express');
const app = express();
const fetch = require('node-fetch');

const getCoordinates = (req, res) => {
    fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      res.json(data);
    })
}

app.get('/iss-now', getCoordinates);

app.listen(3001, () => { console.log(`App is running on port 3001`) });
