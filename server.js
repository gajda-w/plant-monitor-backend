const express = require("express");
const app = express();
const port = 4000;

function getRandomSensorData() {
  const temperature = (Math.random() * (30 - 15) + 15).toFixed(1);
  const humidity = (Math.random() * (100 - 40) + 40).toFixed(1);
  return { temperature, humidity };
}

app.get("/api/sensors", (req, res) => {
  const sensorData = getRandomSensorData();
  res.json(sensorData);
});

app.get("/", (req, res) => {
  res.send("Welcome on the Plant Monitor server");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`server is working http://localhost:${port}`);
});
