const sensor = require('node-dht-sensor').promises;
const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

const sensorType = 22;
const gpioPin = 4;

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    allowHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
  })
);

async function readSensor() {
  try {
    const { temperature, humidity } = await sensor.read(sensorType, gpioPin);
    return {
      temperature: temperature.toFixed(1),
      humidity: humidity.toFixed(1),
    };
  } catch (err) {
    console.error('Failed to read sensor data:', err);
  }
}

app.get('/api/sensors', async (req, res) => {
  const sensorData = await readSensor();
  res.json(sensorData);
});

app.get('/', (req, res) => {
  res.send('Welcome on server');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`server works on http://localhost:${port}`);
});
