import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import http from 'http';
import db from './InfoscreenDB.js';
import { HTML_Table_IDs } from './InfoscreenDB.js';
import { MessageFactory } from './Message.js';
import isPi from 'detect-rpi';

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
    if (!isPi()) {
        setInterval(() => {
            const msg = MessageFactory.CreateStatusMessage(randomIntFromInterval(0, 1) == 0 ? true : false);
            const json_msg = JSON.stringify(msg);
            ws.send(json_msg);
        }, 10000);
    }
};
const OnModelUpdate = () => {
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify(MessageFactory.CreateUpdateMessage()));
    });
};

app.post('/updateAll', jsonParser, async (req, res) => {
    try {
        await db.updateHolidays(JSON.stringify(req.body.Holidays));
        await db.updateHeadLines(JSON.stringify(req.body.HeadLines));
        for (let i = 0; i < req.body.HTMLTables.length; i++) {
            await db.updateHTMLTable(i, JSON.stringify(req.body.HTMLTables[i]));
        }
        res.sendStatus(200);
        OnModelUpdate();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/updateAll');
});

app.post('/updateHeadLines', jsonParser, async (req, res) => {
    try {
        await db.updateHeadLines(JSON.stringify(req.body));

        res.sendStatus(200);
        OnModelUpdate();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/updateHeadLines');
});
app.post('/updateHTMLTables', jsonParser, async (req, res) => {
    try {
        let tableArray = req.body;
        for (let i = 0; i < tableArray.length; i++) {
            await db.updateHTMLTable(i, tableArray[i]);
        }
        OnModelUpdate();

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/updateHTMLTables');
});
app.post('/updateHolidays', jsonParser, async (req, res) => {
    try {
        await db.updateHolidays(JSON.stringify(req.body));
        OnModelUpdate();

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/updateHolidays');
});

app.get('/getAll', async (req, res) => {
    let data = {
        Holidays: [],
        HeadLines: [],
        HTMLTables: [],
    };
    data.Holidays = JSON.parse(await db.getHolidaysAsJsonString());
    data.HeadLines = JSON.parse(await db.getHeadLinesAsJsonString());
    let promises: Promise<string>[] = [];
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.PreviousSunday));
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.BusinessDays));
    promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.ComingSunday));
    let HTMLTablesAsJsonStrings = await Promise.all(promises);
    const HTMLTablesAsArrays = HTMLTablesAsJsonStrings.map((json_string) => {
        return JSON.parse(json_string);
    });
    data.HTMLTables = HTMLTablesAsArrays;
    let dataAsJsonString = JSON.stringify(data);
    res.send(dataAsJsonString);
    console.log('/getAll');
});

app.get('/getHolidays', (req, res) => {
    try {
        db.getHolidaysAsJsonString().then((holidayString) => {
            res.send(holidayString);
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/getHolidays');
});

app.get('/getHTMLTables', async (req, res) => {
    try {
        let promises: Promise<string>[] = [];
        promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.PreviousSunday));
        promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.BusinessDays));
        promises.push(db.getHTMLTableAsJsonString(HTML_Table_IDs.ComingSunday));
        let result = await Promise.all(promises);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/getHTMLTables');
});
app.get('/getHeadLines', (req, res) => {
    try {
        db.getHeadLinesAsJsonString().then((headLinesString) => {
            res.send(headLinesString);
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    console.log('/getHeadLines');
});

wss.on('connection', (ws, req) => {
    handleConnections(ws, req);
});

//Configure Static routes
app.use(express.static('static'));
app.use(express.static('static'));
app.use(express.static('dist'));
app.use('/src', express.static('src'));

server.listen(3000, () => {
    console.log('Listening on port :3000');
});

if (isPi()) {
    const Gpio = require('onoff');
    const outPin = new Gpio(17, 'out');
    const status_switch = new Gpio(4, 'in', 'both', { debounceTimeout: 10 });
    console.log('GPIO active');
    let currentValue = 1;
    status_switch.watch((err, value) => {
        if (err) {
            console.log(err);
        }
        if (currentValue != value) {
            wss.clients.forEach((ws) => {
                ws.send(JSON.stringify(MessageFactory.CreateStatusMessage(0 === value)));
            });
            outPin.writeSync(value);
            currentValue = value;
        }
        console.log(value);
    });

    process.on('SIGINT', (_) => {
        outPin.unexport();
        status_switch.unexport();
        console.log('Closed all GPIO pins');
    });
}

//#####Remove#####//
const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
