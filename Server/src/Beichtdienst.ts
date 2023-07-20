import { Database, State, insertArrayDataIntoHTMLTable, toggleHoliday, updateHolidayTableColors } from './main.js';
import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { Message, MessageTypes } from './Message.js';

let state = new State();
let db = new Database(window.location.host, state);
let ws = new ReconnectingWebSocket('ws://localhost:3000');
addEventListener('DOMContentLoaded', (event) => {
    ws.onMessage = (httpMessage) => {
        console.log(httpMessage.data);
        let msg = JSON.parse(httpMessage.data);
        if (msg.type == MessageTypes.updateView) {
            db.getHolidays().then((res) => {
                updateHolidayTableColors(res);
                state.holidays = res;
            });
            db.getHTMLTable().then((json_result) => {
                for (let i = 0; i < json_result.length; i++) {
                    insertArrayDataIntoHTMLTable(i, json_result[i]);
                }
            });
            db.getHeadLines().then((res) => {
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

    
    db.getHolidays().then((res) => {
        updateHolidayTableColors(res);
        state.holidays = res;
    });
    db.getHTMLTable().then((json_result) => {
        for (let i = 0; i < json_result.length; i++) {
            insertArrayDataIntoHTMLTable(i, json_result[i]);
        }
    });
    db.getHeadLines().then((res) => {
        for (let i = 0; i < res.length; i++) {
            document.getElementById(`line${i}`).innerHTML = res[i];
        }
    });
});
