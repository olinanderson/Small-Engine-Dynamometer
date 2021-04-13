const express = require("express");

// Initialize app
const app = express();

const SerialPort = require("serialport"),
  Readline = require("@serialport/parser-readline"),
  server = require("http").createServer(app),
  chalk = require("chalk"),
  fs = require("fs"),
  io = require("socket.io")(server);

const COM = "COM6";
const baudRate = 115200;
var currentLbft = 0;
var currentRpm = 0;
var lbFtArray = [];
var rpmArray = [];
var globalDataArray = [];
var totalSeconds = 0;
// Set this as true, and the rpm, and torque values will save to JSON file named rawData.json
var saveData = false;
var simulateData = true;
var counter = 0;
var push = JSON.parse(fs.readFileSync("./rawData/rawData01.json"));

// Initializing PORT and Baud Rate for the Arduino
const port = new SerialPort(COM, { baudRate: baudRate });
const parser = port.pipe(new Readline({ delimiter: "\n" })); // Read the port data

port.on("open", async () => {
  console.log(chalk.greenBright("serial port open"));
});

parser.on("data", (data) => {
  var dataCopy = data;

  currentLbft = dataCopy.substring(
    dataCopy.indexOf(",") + 1,
    dataCopy.length - 1
  );
  currentRpm = dataCopy.substring(0, dataCopy.indexOf(","));

  currentLbft = Number(currentLbft.substring(0, currentLbft.indexOf("l")));
  currentRpm = Number(currentRpm.substring(0, currentRpm.indexOf("r")));

  lbFtArray.push(currentLbft);
  rpmArray.push(currentRpm);

  if (lbFtArray.length > 120) {
    lbFtArray.unshift();
  }

  if (rpmArray.length > 120) {
    rpmArray.unshift();
  }

  globalDataArray.push({
    torque: lbFtArray[lbFtArray.length - 1],
    rpm: rpmArray[rpmArray.length - 1],
    time: countTimer(),
  });

  // io.broadcast.emit("changeData", globalDataArray[globalDataArray.length - 1]);

  if (globalDataArray.length > 120) {
    globalDataArray.unshift();
  }

  console.log(currentRpm, " rpm, ", currentLbft, " lbs");

  if (saveData) {
    let rawData = JSON.stringify(globalDataArray);
    fs.writeFileSync("rawData.json", rawData);
  }
});

// Route API
app.use("/api/loadData/", async (req, res) => {
  try {
    console.log(chalk.greenBright("Initial load route hit"));
    return res.json(globalDataArray);
  } catch (err) {
    console.log("Error in backend route:", chalk.red(err));
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  var interval = setInterval(() => {
    if (globalDataArray.length > push.length - 1) {
      globalDataArray = [];
      counter = 0;
    }
    socket.emit("changeData", globalDataArray);
  }, 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(5000, () => {
  console.log(chalk.greenBright.bold("Server started on port 5000"));
});

// Global Functions
function countTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (seconds < 10) seconds = "0" + seconds;

  return hour + ":" + minute + ":" + seconds;
}

if (simulateData) {
  setInterval(() => {
    globalDataArray.push({
      "Torque (ft-lb)": push[counter].torque,
      "Power (hp)": (push[counter].torque * push[counter].rpm) / 5252,
      "Rpm (revolutions per minute)": push[counter].rpm,
      time: push[counter].time,
    });
    if (counter === push.length - 1) {
      counter = 0;
    } else {
      counter++;
    }
  }, 1000);
}
