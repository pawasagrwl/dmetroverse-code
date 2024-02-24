require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: [process.env.FE_URL],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // If you need to parse JSON bodies

const getCurrentTimeInIST = () => {
  const now = new Date();
  now.setHours(now.getHours() + 5 + Math.floor(now.getMinutes() / 60));
  now.setMinutes(now.getMinutes() % 60 + 30); // Adjust for IST timezone (+5:30)
  return now.toISOString().replace('Z', ''); // Remove 'Z' to avoid implying UTC
};

app.get('/', (req, res) => {
  console.log(`Plain request received from ${req.headers.referer}: ${req.ip}`);
  res.send('This server uses cors to access delhimetrorail. If you need access, contact the developer (dmetroverse@gmail.com).');
});

app.get('/:origin/:destination/:type?', async (req, res) => {
  const { origin, destination } = req.params;
  const type = req.params.type === 'mi' ? 'minimum-interchange' : 'least-distance';

  const currentTime = getCurrentTimeInIST();
  const apiEndpoint = `https://backend.delhimetrorail.com/api/v2/en/station_route/${origin}/${destination}/${type}/${currentTime}`;

  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        Referer: 'https://www.delhimetrorail.com/',
        Origin: 'https://www.delhimetrorail.com',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.text();
    res.send(data);
    console.log(apiEndpoint);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
