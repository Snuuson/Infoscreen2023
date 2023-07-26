import { Controller, insertArrayDataIntoHTMLTable, toggleHoliday, updateHolidayTableColors } from './Controller.js';
import GetAllCompositeDataContainer from './GetAllCompositeDataContainer.js';
import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { Message, MessageTypes } from './Message.js';

let controller = new Controller(window.location.host);
let ws;
const setSign = (err: any, canEnter: boolean) => {
    let sign = document.getElementById('sign');
    if (err) {
        sign.innerHTML = 'NO SIGNAL';
        sign.style.backgroundColor = '#C8D96F';
        return;
    }
    if (canEnter === true) {
        sign.innerHTML = 'BITTE   EINTRETEN';
        sign.style.backgroundColor = 'green';
    } else {
        sign.innerHTML = 'BITTE   WARTEN';
        sign.style.backgroundColor = '#b534d8';
    }
};
let updateView = (dataArray: GetAllCompositeDataContainer) => {
    //Insert Holidays
    updateHolidayTableColors(dataArray.Holidays);
    controller.holidays = dataArray.Holidays;

    //Insert Tables
    for (let i = 0; i < dataArray.HTMLTables.length; i++) {
        insertArrayDataIntoHTMLTable(i, dataArray.HTMLTables[i]);
    }

    //Insert Headlines
    for (let i = 0; i < dataArray.HeadLines.length; i++) {
        document.getElementById(`line${i}`).innerHTML = dataArray.HeadLines[i];
    }
};

const setUpWebSocket = () => {
    const onOpen = () => {
        controller.getAll().then((res) => {
            console.log(`getAll result from database:`);
            console.log(res);
            updateView(res);
        });
    };
    const onMessage = (httpMessage) => {
        console.log(httpMessage.data);
        let msg = JSON.parse(httpMessage.data);
        if (msg.type == MessageTypes.updateView) {
            controller.getAll().then((res) => {
                console.log(`getAll result from database:`);
                console.log(res);
                updateView(res);
            });
        } else if (msg.type == MessageTypes.status) {
            setSign(null, msg.value);
        }
    };
    const onClose = () => {
        setSign(true, false);
    };
    ws = new ReconnectingWebSocket(`ws://${window.location.host}`, onOpen, onMessage, onClose);
};

addEventListener('DOMContentLoaded', (event) => {
    setSign(true, false);
    setUpWebSocket();
    controller.getAll().then((res: GetAllCompositeDataContainer) => {
        console.log(`getAll result from database:`);
        console.log(res);
        updateView(res);
    });
});
