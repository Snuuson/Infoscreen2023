import { Controller, insertArrayDataIntoHTMLTable, toggleHoliday, updateHolidayTableColors } from './Controller.js';
import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { Message, MessageTypes } from './Message.js';

let controller = new Controller(window.location.host);
let ws = new ReconnectingWebSocket(`ws://${window.location.host}`);
addEventListener('DOMContentLoaded', (event) => {
    ws.onMessage = (httpMessage) => {
        console.log(httpMessage.data);
        let msg = JSON.parse(httpMessage.data);
        if (msg.type == MessageTypes.updateView) {
            controller.getHolidays().then((res) => {
                updateHolidayTableColors(res);
                controller.holidays = res;
            });
            controller.getHTMLTable().then((json_result) => {
                for (let i = 0; i < json_result.length; i++) {
                    insertArrayDataIntoHTMLTable(i, json_result[i]);
                }
            });
            controller.getHeadLines().then((res) => {
                for (let i = 0; i < res.length; i++) {
                    document.getElementById(`line${i}`).innerHTML = res[i];
                }
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

    
    controller.getHolidays().then((res) => {
        updateHolidayTableColors(res);
        controller.holidays = res;
    });
    controller.getHTMLTable().then((json_result) => {
        for (let i = 0; i < json_result.length; i++) {
            insertArrayDataIntoHTMLTable(i, json_result[i]);
        }
    });
    controller.getHeadLines().then((res) => {
        for (let i = 0; i < res.length; i++) {
            document.getElementById(`line${i}`).innerHTML = res[i];
        }
    });
});
