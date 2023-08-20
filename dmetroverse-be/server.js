require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); 

const app = express();

const port = process.env.PORT || 3000;
const fe_port = process.env.FE_PORT
const fe_url = process.env.FE_URL

function getCurrentTimeInIST() {
  let date = new Date();

  // convert it to the IST timezone and add 5 minutes
  let ISTDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  ISTDate.setMinutes(ISTDate.getMinutes() + 5);

  let year = ISTDate.getFullYear();
  let month = ("0" + (ISTDate.getMonth() + 1)).slice(-2);
  let day = ("0" + ISTDate.getDate()).slice(-2);
  let hours = ("0" + ISTDate.getHours()).slice(-2);
  let minutes = ("0" + ISTDate.getMinutes()).slice(-2);
  let seconds = ("0" + ISTDate.getSeconds()).slice(-2);
  let milliseconds = ("00" + ISTDate.getMilliseconds()).slice(-3);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Set the CORS options
const corsOptions = {
  origin: [`http://localhost:${fe_port}`, `${fe_url}`], 
  optionsSuccessStatus: 200
};

// Use the cors middleware and pass the corsOptions
app.use(cors(corsOptions));


// // use middleware to check authorization
// app.use((req, res, next) => {
//   // this is a very basic authorization and not very secure. It can be improved.
//   const secretToken = 'YOUR_SECRET_TOKEN'; // replace this with your secret token
//   const token = req.headers.authorization;

//   if (token === secretToken) {
//     next();
//   } else {
//     res.status(403).send('Not authorized');
//   }
// });

app.get('/', (req, res) => {
  console.log(`Plain request received from ${req.headers.referer}: ${req.ip}`);
  res.send('This server uses cors to access delhimetrorail. If you need access, contact the developer (dmetroverse@gmail.com).');
});

app.get('/:origin/:destination', async (req, res) => {
  console.log(`Route Request received from ${req.headers.referer}: ${req.ip}`)
  let origin = req.params.origin;
  let destination = req.params.destination;
  let currentTime = getCurrentTimeInIST();
  let apiEndpoint = `https://backend.delhimetrorail.com/api/v2/en/station_route/${origin}/${destination}/least-distance/${currentTime}`;

  const response = await fetch(apiEndpoint, {
    headers: {
      'Referer': 'https://www.delhimetrorail.com/',
      'Origin': 'https://www.delhimetrorail.com',
    },
  });

  const data = await response.text();
  res.send(data);
  console.log(apiEndpoint)
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
