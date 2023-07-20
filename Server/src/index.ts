import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import http from 'http';
import db from './InfoscreenDB.js';
import { HTML_Table_IDs } from './InfoscreenDB.js';
import {MessageFactory} from './Message.js';
const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const jsonParser = bodyParser.json();

const handleConnections = (ws, req) => {
    console.log('A new Client Connected.');
    console.log(req.socket.remoteAddress);
    ws.on('message', (messageString) => {});
    ws.on('close', () => {
        ws.send('Client Disconnected: ');
    });
    setInterval(() => {
        const msg = MessageFactory.CreateStatusMessage(randomIntFromInterval(0, 1) == 0 ? true : false);
        const json_msg = JSON.stringify(msg);
        ws.send(json_msg);
    }, 1000);
    
};
const OnModelUpdate = (req,res,next) => {
    wss.clients.forEach((ws)=>{
        ws.send(JSON.stringify(MessageFactory.CreateUpdateMessage()))
    })
    next()
};


app.post('/updateHeadLines',OnModelUpdate, jsonParser, (req, res) => {
    try {
        db.updateHeadLines(JSON.stringify(req.body));
        console.log('/updateHeadLines');
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});
app.post('/updateHTMLTables',OnModelUpdate, jsonParser, (req, res) => {
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
app.post('/updateHolidays',OnModelUpdate, jsonParser, (req, res) => {
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
app.use(express.static('static'));
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
