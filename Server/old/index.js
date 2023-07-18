var express = require('express');
var app = express();
var NodeWebSocket = require('ws');
var server = require('http').createServer(app);
var wss = new NodeWebSocket.Server({ server: server });
var db = require('./InfoscreenDB.js');
var messages = require("./Message.js");
var config = {
    port: 3000
};
app.get('/', function (req, res) { return res.send('Hello'); });
wss.on('connection', function (ws, req) {
});
app.use(express.static('public'));
app.use(express.static('websocket'));
server.listen(config.port, function () {
    console.log('Listening on port :3000');
});
var handleConnections = function (ws, req) {
    console.log('A new client connected');
    console.log(req.socket.remoteAddress);
    ws.on('message', function (message) {
        var m = JSON.parse(message);
        if (m.type == message.MessageTypes.status) {
        }
        if (m.type == message.MessageTypes.table) {
        }
        if (m.type == message.MessageTypes.holiday) {
        }
    });
    ws.on('close', function () {
        ws.send('Client Disconnected: ');
    });
    setInterval(function () {
        ws.send('Status ' + randomIntFromInterval(0, 1));
    }, 500);
};
var m = messages.create(messages.MessageTypes.status, "[]");
var randomIntFromInterval = function (min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
