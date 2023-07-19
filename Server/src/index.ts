import express, { Express, Request, Response } from 'express';
const app: Express = express();
import { WebSocketServer } from 'ws';
import http from 'http';
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
import mydb from './InfoscreenDB.js';
import { Message, MessageFactory,MessageTypes } from './Message.js';

const handleConnections = (ws, req) => {
    console.log('A new client connected');
    console.log(req.socket.remoteAddress);
    ws.on('message', (messageString) => {
        console.log('received: %s', messageString);
        try {
            let message:Message = JSON.parse(messageString.toString());
            if (message.type == MessageTypes.status) {
            }
            if (message.type == MessageTypes.table) {
                mydb.updateHTML_Table(message.tableId,message.value).then(()=>{
                    
                })
            }
            if (message.type == MessageTypes.holiday) {
                mydb.updateHolidays(message.value)
            }
        } catch (err) {
            console.log(err);
        }
    });
    ws.on('close', () => {
        ws.send('Client Disconnected: ');
    });
    setInterval(() => {
        ws.send('Status ' + randomIntFromInterval(0, 1));
    }, 10000);
};

console.log(await mydb.getHTML_Table(1));
const config = {
    port: 3000,
};

app.get('/', (req, res) => res.send('Hello'));
wss.on('connection', (ws, req) => {
    handleConnections(ws, req);
});
app.use(express.static('public'));
app.use(express.static('dist'));
app.use("/src",express.static('src'));
server.listen(config.port, () => {
    console.log('Listening on port :3000');
});

const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
