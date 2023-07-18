const express = require('express');
const app = express();
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const db = require('./InfoscreenDB.js');
const messages = require("./Message.js")

const config={
    port: 3000
}

app.get('/', (req, res) => res.send('Hello'));
wss.on('connection', (ws, req) => {
    
});
app.use(express.static('public'));
app.use(express.static('websocket'));
server.listen(config.port, () => {
    console.log('Listening on port :3000');
});


const handleConnections = (ws,req) =>{
    console.log('A new client connected');
    console.log(req.socket.remoteAddress);
    ws.on('message', (message) => {
        let m = JSON.parse(message);
        if(m.type == message.MessageTypes.status){

        }
        if(m.type == message.MessageTypes.table){
            
        }
        if(m.type == message.MessageTypes.holiday){
            
        }
    });
    ws.on('close', () => {
        ws.send('Client Disconnected: ');
    });
    setInterval(() => {
        ws.send('Status ' + randomIntFromInterval(0, 1));
    }, 500);
}

const m = messages.create(messages.MessageTypes.status,"[]");













const randomIntFromInterval=(min, max)=> {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

