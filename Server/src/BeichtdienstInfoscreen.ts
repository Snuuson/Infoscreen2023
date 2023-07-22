import { GetAllCompositeDataContainer, Controller, insertArrayDataIntoHTMLTable, toggleHoliday, updateHolidayTableColors } from './Controller.js';
import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { Message, MessageTypes } from './Message.js';

let controller = new Controller(window.location.host);
let ws = new ReconnectingWebSocket(`ws://${window.location.host}`);

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
addEventListener('DOMContentLoaded', (event) => {
    ws.onOpen = () => {
        controller.getAll().then((res) => {
            console.log(`getAll result from database:`);
            console.log(res);
            updateView(res);
        });
    };
    ws.onMessage = (httpMessage) => {
        console.log(httpMessage.data);
        let msg = JSON.parse(httpMessage.data);
        if (msg.type == MessageTypes.updateView) {
            controller.getAll().then((res) => {
                console.log(`getAll result from database:`);
                console.log(res);
                updateView(res);
            });
        }
        if (msg.type == MessageTypes.status) {
            let sign = document.getElementById('sign');
            if (msg.value == true) {
                sign.innerHTML = 'BITTE   EINTRETEN';
                sign.style.backgroundColor = 'green';
            } else {
                sign.innerHTML = 'BITTE   WARTEN';
                sign.style.backgroundColor = '#b534d8';
            }
        }
    };

    let sign = document.getElementById('sign');
    sign.innerHTML = 'BITTE   WARTEN';
    sign.style.backgroundColor = '#b534d8';

    controller.getAll().then((res: GetAllCompositeDataContainer) => {
        console.log(`getAll result from database:`);
        console.log(res);
        updateView(res);
    });
});
