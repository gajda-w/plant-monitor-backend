const sensor = require('node-dht-sensor').promises;
const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

const sensorType = 22;
const gpioPin = 4;

let lightStartHour = 6;
let lightEndHour = 23;

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://plant-monitor-frontend-rouge.vercel.app/',
    ],
    methods: ['GET', 'POST'], // <--- DODAJ POST
    allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
  })
);

app.use(express.json()); // <--- TO JEST KLUCZOWE!

async function readSensor() {
  try {
    const { temperature, humidity } = await sensor.read(sensorType, gpioPin);
    return {
      temperature: temperature.toFixed(1),
      humidity: humidity.toFixed(1),
    };
  } catch (err) {
    console.error('Failed to read sensor data:', err);
    return null;
  }
}

const getLightStatus = () => {
  const currentHour = new Date().getHours();
  return currentHour >= lightStartHour && currentHour < lightEndHour;
};

app.get('/api/status', async (req, res) => {
  const sensorData = {
    sensors: await readSensor(),
    isLightOn: getLightStatus(),
    isFanOn: true,
    isHumidifierOn: true,
    lightStartHour: lightStartHour,
    lightEndHour: lightEndHour,
  };
  res.json(sensorData);
});

app.post('/api/light-hours', (req, res) => {
  const { startHour, endHour } = req.body;
  if (
    typeof startHour === 'number' &&
    typeof endHour === 'number' &&
    startHour >= 0 &&
    endHour <= 24
  ) {
    lightStartHour = startHour;
    lightEndHour = endHour;
    return res.json({ success: true });
  }
  return res.status(400).json({ success: false, message: 'Invalid hours' });
});

app.get('/', (req, res) => {
  res.send('Welcome on server');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`server works on http://localhost:${port}`);
});
