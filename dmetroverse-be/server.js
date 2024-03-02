require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const fePort = process.env.FE_PORT
const feUrl = process.env.FE_URL;
const fePath = process.env.FE_PATH || ''; // Default to an empty string if FE_PATH is not defined

// Configure CORS options dynamically
const corsOptions = {
  origin: [`http://localhost:${fePort}`, feUrl],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Utility function to calculate the current time in IST
const getCurrentTimeInIST = () => {
  let now = new Date();
  now = new Date(now.getTime() + (5 * 60 + 30) * 60000); // Offset by 5 hours and 30 minutes
  return now.toISOString().replace('Z', '');
};

app.get('/', (req, res) => {
  res.redirect(`${feUrl}${fePath}`);
});

// Validate parameters before proceeding
const validateParams = (req, res, next) => {
  const { origin, destination, type } = req.params;
  if (!origin || !destination) {
    return res.status(400).send('Origin and destination parameters are required.');
  }
  if (type && !['least-distance', 'minimum-interchange'].includes(type)) {
    return res.status(400).send('Invalid type parameter.');
  }
  next();
};

app.get('/:origin/:destination/:type?', validateParams, async (req, res) => {
  const { origin, destination, type } = req.params;
  const routeType = type === 'mi' ? 'minimum-interchange' : 'least-distance';
  const currentTime = getCurrentTimeInIST();
  const apiEndpoint = `https://backend.delhimetrorail.com/api/v2/en/station_route/${origin}/${destination}/${routeType}/${currentTime}`;

  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        Referer: 'https://www.delhimetrorail.com/',
        Origin: 'https://www.delhimetrorail.com',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
