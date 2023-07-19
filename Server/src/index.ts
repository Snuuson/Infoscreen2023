import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
const app: Express = express();
import { WebSocketServer } from 'ws';
import http from 'http';
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const jsonParser = bodyParser.json();
import db from './InfoscreenDB.js';
import { HTML_Table_IDs } from './InfoscreenDB.js';
import { Message, MessageFactory, MessageTypes } from './Message.js';

const handleConnections = (ws, req) => {
    console.log('A new client connected');
    console.log(req.socket.remoteAddress);
    ws.on('message', (messageString) => {});
    ws.on('close', () => {
        ws.send('Client Disconnected: ');
    });
    setInterval(() => {
        ws.send('Status ' + randomIntFromInterval(0, 1));
    }, 10000);
};

app.post('/updateHeadLines', jsonParser, (req, res) => {
    try {
        db.updateHeadLines(JSON.stringify(req.body));
        console.log('/updateHeadLines');
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});
app.post('/updateHTMLTables', jsonParser, (req, res) => {
    try {
        let tableArray = req.body;
        for (let i = 0; i < tableArray.length; i++) {
            db.updateHTMLTable(i, tableArray[i]);
        }
        console.log('/updateHTMLTables');
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});
app.post('/updateHolidays', jsonParser, (req, res) => {
    try {
        db.updateHolidays(JSON.stringify(req.body));
        console.log('/updateHolidays');
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});

app.get('/getHolidays', (req, res) => {
    db.getHolidaysAsJsonString().then((holidayString) => {
        res.send(holidayString);
    });
    console.log('/getHolidays');
});
app.get('/getHTMLTables', async (req, res) => {
    let promises: Promise<string>[] = [];
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.PreviousSunday));
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.BusinessDays));
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.ComingSunday));
    let result = await Promise.all(promises);
    res.send(JSON.stringify(result));
    console.log('/getHTMLTables');
});
app.get('/getHeadLines', (req, res) => {
    db.getHeadLinesAsJsonString().then((headLinesString) => {
        res.send(headLinesString);
        console.log('/getHeadLines');
    });
});

wss.on('connection', (ws, req) => {
    handleConnections(ws, req);
});

//Configure Static routes
app.use(express.static('public'));
app.use(express.static('dist'));
app.use('/src', express.static('src'));

server.listen(3000, () => {
    console.log('Listening on port :3000');
});

//#####Remove#####//
const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
