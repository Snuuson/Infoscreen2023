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

const toggleHoliday = (weekdayIndex: number, controller: Controller) => {
    if (weekdayIndex == -1) {
        resetHolidays(controller);
    } else {
        controller.holidays[weekdayIndex] = !controller.holidays[weekdayIndex];
    }
    updateHolidayTableColors(controller.holidays);
};

const resetHolidays = (controller: Controller) => {
    for (let i = 0; i < controller.holidays.length; i++) {
        controller.holidays[i] = false;
        (<HTMLInputElement>document.getElementById(`weekday${i}`)).checked = false
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

class PostParams {
    body = '';
    method = 'POST';
    headers = {
        'Content-Type': 'application/json; charset=UTF-8',
    };
    constructor(bodyString) {
        this.body = bodyString;
    }
}

class Controller {
    holidays: boolean[] = Array(6).fill(false);
    serverAddress: string;
    postParams = {
        body: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    };
    constructor(serverAddress: string) {
        this.serverAddress = serverAddress;
    }
    getHolidays = async () => {
        const URL = `http://${this.serverAddress}/getHolidays`;
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };
    getHTMLTable = async () => {
        const URL = `http://${this.serverAddress}/getHTMLTables`;
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };
    getHeadLines = async () => {
        const URL = `http://${this.serverAddress}/getHeadLines`;
        let result = await fetch(URL);
        let json_result = await result.json();
        return json_result;
    };

    updateHolidays = async (): Promise<Response> => {
        const URL = `http://${this.serverAddress}/updateHolidays`;
        const postParams = new PostParams(JSON.stringify(this.holidays));
        return fetch(URL, postParams);
    };

    updateHTMLTables = async (): Promise<Response> => {
        let tableArray: string[] = [];
        for (let i = 0; i < 3; i++) {
            tableArray[i] = JSON.stringify(transformHTMLTableToArray(i));
        }
        const URL = `http://${this.serverAddress}/updateHTMLTables`;
        const otherParam = {
            body: JSON.stringify(tableArray),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        };
        return fetch(URL, otherParam);
    };

    updateHeadLines = async (): Promise<Response> => {
        let lineArray: string[] = [];
        for (let i = 0; i < 2; i++) {
            let line = <HTMLParagraphElement>document.getElementById(`line${i}`);
            lineArray.push(line.innerHTML);
        }
        const URL = `http://${this.serverAddress}/updateHeadLines`;
        const otherParam = {
            body: JSON.stringify(lineArray),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        };
        return fetch(URL, otherParam);
    };

    saveDocument = async () => {
        let promises: Promise<Response>[] = [];
        promises.push(this.updateHolidays());
        promises.push(this.updateHTMLTables());
        promises.push(this.updateHeadLines());
        await Promise.all(promises).then((res) => {
            let errors = false;
            res.forEach((res) => {
                if (res.status != 200) {
                    errors = true;
                }
            });
            if (errors == false) {
                alert('Dokument wurde gespeichert.');
            }
        });
    };
}

export { Controller, updateHolidayTableColors, toggleHoliday, insertArrayDataIntoHTMLTable };
