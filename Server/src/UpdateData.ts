const updateHolidayTableColors = (holidays: boolean[]) => {
    let table = <HTMLTableElement>document.getElementById('table1');

    for (var i = 1; i < table.rows.length; i++) {
        if (holidays[i - 1] == true) {
            table.rows[i].cells[0].style.color = '#e65c00';
            table.rows[i].cells[0].style.fontWeight = 'bold';
        } else {
            table.rows[i].cells[0].style.color = 'black';
            table.rows[i].cells[0].style.fontWeight = 'normal';
        }
    }
};

const toggleHoliday = (weekdayIndex: number) => {
    if (weekdayIndex == -1) {
        resetHolidays();
    } else {
        globalThis.state.holidays[weekdayIndex] = !globalThis.state.holidays[weekdayIndex];
    }
    updateHolidayTableColors(globalThis.state.holidays);
};

const resetHolidays = () => {
    for (let i = 0; i < globalThis.state.holidays.length; i++) {
        globalThis.state.holidays[i] = false;
    }
};

const insertArrayDataIntoHTMLTable = (tableId: number, json_string: string) => {
    let data = JSON.parse(json_string);
    let maxRowLength = 0;
    for (let i = 0; i < data.length; i++) {
        maxRowLength = data[i].length > maxRowLength ? data[i].length : maxRowLength;
    }
    var table = <HTMLTableElement>document.getElementById(`table${tableId}`);
    for (var row = 0; row < data.length; row++) {
        for (var column = 0; column < data[row].length; column++) {
            table.rows[row].cells[column].innerHTML = data[row][column].replace(/ /g, '&nbsp;');
        }
    }
};

const transformHTMLTableToArray = (tableId: number) => {
    var table = <HTMLTableElement>document.getElementById(`table${tableId}`);
    var myArray = [];
    for (var r = 0; r < table.rows.length; r++) {
        myArray[r] = [];
        for (var s = 0; s < table.rows[r].cells.length; s++) {
            let inner = table.rows[r].cells[s].innerHTML;
            var re = new RegExp(String.fromCharCode(32), 'g');
            inner = inner.replace(re, '');
            // for(let i = 0; i < inner.length; i++){
            //     console.log(inner[i])
            //     console.log(inner.charCodeAt(i))
            // }
            //inner = inner.replace(/&nbsp;/g, '');
            myArray[r][s] = inner;
        }
    }

    return myArray;
};

class State {
    holidays: boolean[] = Array(6).fill(false);
}
class PostParams{
    body = ''
    method='POST'
    headers= {
        'Content-Type': 'application/json; charset=UTF-8',
    }
    constructor(bodyString){
        this.body = bodyString
    }
}
class Database {
    pageState: State;
    postParams = {
        body: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    };
    constructor(state: State) {
        this.pageState = state;
    }
    getHolidays = async () => {
        const URL = 'http://localhost:3000/getHolidays';
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };
    updateHolidays = async () => {
        const URL = 'http://localhost:3000/updateHolidays';
        const postParams = new PostParams(JSON.stringify(globalThis.state.holidays))
        fetch(URL, postParams);
    };

    getHTMLTable = async () => {
        const URL = 'http://localhost:3000/getHTMLTables';
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };
    updateHTMLTables = async () => {
        let tableArray: string[] = [];
        for (let i = 0; i < 3; i++) {
            tableArray[i] = JSON.stringify(transformHTMLTableToArray(i));
        }
        const URL = 'http://localhost:3000/updateHTMLTables';
        const otherParam = {
            body: JSON.stringify(tableArray),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        };
        fetch(URL, otherParam);
    };

    getHeadLines = async () => {
        const URL = 'http://localhost:3000/getHeadLines';
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };
    updateHeadLines = async () => {
        let lineArray: string[] = [];
        for (let i = 0; i < 2; i++) {
            let line = <HTMLParagraphElement>document.getElementById(`line${i}`);
            lineArray.push(line.innerHTML);
        }
        const URL = 'http://localhost:3000/updateHeadLines';
        const otherParam = {
            body: JSON.stringify(lineArray),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        };
        fetch(URL, otherParam);
    };

    saveDocument = async () => {
        this.updateHolidays();
        this.updateHTMLTables();
        this.updateHeadLines();
    };
}

globalThis.state = new State();
globalThis.db = new Database(globalThis.state);
globalThis.updateHolidayTableColors = updateHolidayTableColors;
globalThis.toggleHoliday = toggleHoliday;
globalThis.insertArrayDataIntoHTMLTable = insertArrayDataIntoHTMLTable;
export {};
