import ReconnectingWebSocket from './ReconnectingWebSocket.js';
import { MessageFactory } from './Message.js';

console.log('UpdateData.ts imported');
let ws = new ReconnectingWebSocket('ws://localhost:3000'); //'ws://192.168.8.105:3000'
let holidays: boolean[];

const transformTableToJsonString = (id: number): string => {
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

const toggleHoliday = (weekdayIndex: number) => {
    if (weekdayIndex == -1) {
		resetHolidayArray()
    }else{
		holidays[weekdayIndex] = !holidays[weekdayIndex]
	}
};

const updateHolidayColors =()=>{
	let table = <HTMLTableElement>document.getElementById("table1");
	for(var i = 1;i<table.rows.length;i++){
		if(holidays[i-1] == true){
			table.rows[i].cells[0].style.color = '#e65c00';
			table.rows[i].cells[0].style.fontWeight = 'bold';
		}else{
			table.rows[i].cells[0].style.color = 'black';
			table.rows[i].cells[0].style.fontWeight = 'normal';
		}
	}
}

const resetHolidayArray = () => {
	holidays.forEach((isHoliday) => {
		isHoliday = false
	});
};
document.querySelectorAll('.FeiertagButton').forEach((button,i)=>{
	button.addEventListener("click",()=>{toggleHoliday(i)})
})
export {toggleHoliday}

