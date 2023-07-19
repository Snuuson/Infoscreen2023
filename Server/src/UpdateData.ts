import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { MessageFactory } from './Message.js';

console.log('UpdateData.ts imported');

class DataUpdater {
    ws: ReconnectingWebSocket;
    holidays: boolean[];
    constructor(webserverAddress = 'ws://localhost:3000') {
        this.ws = new ReconnectingWebSocket(webserverAddress); //'ws://192.168.8.105:3000'
        this.holidays = Array(6).fill(false);
    }
    print() {
        console.log('Success');
    }

    submitHolidaysToDatabase = () => {
		let msg = MessageFactory.CreateHolidayMessage(JSON.stringify(this.holidays))
		this.ws.sendMessage(msg)
	};

    transformTableToJsonString = (id: number): string => {
        let table = <HTMLTableElement>document.getElementById(`table${id}`);
        let tableArray = [];
        for (var r = 0; r < table.rows.length; r++) {
            tableArray[r] = [];
            for (var s = 0; s < table.rows[r].cells.length; s++) {
                tableArray[r][s] = table.rows[r].cells[s].innerHTML.replace(/&nbsp;/g, ' ');
            }
        }
        return JSON.stringify(tableArray);
    };

    toggleHoliday = (weekdayIndex: number) => {
        if (weekdayIndex == -1) {
            this.resetHolidayArray();
        } else {
            this.holidays[weekdayIndex] = !this.holidays[weekdayIndex];
        }
        this.updateHolidayColors();
    };

    updateHolidayColors = () => {
        let table = <HTMLTableElement>document.getElementById('table1');
        for (var i = 1; i < table.rows.length; i++) {
            if (this.holidays[i - 1] == true) {
                table.rows[i].cells[0].style.color = '#e65c00';
                table.rows[i].cells[0].style.fontWeight = 'bold';
            } else {
                table.rows[i].cells[0].style.color = 'black';
                table.rows[i].cells[0].style.fontWeight = 'normal';
            }
        }
    };

    resetHolidayArray = () => {
        this.holidays.forEach((isHoliday, index, holidays) => {
            holidays[index] = false;
        });
    };
}

export { DataUpdater };
