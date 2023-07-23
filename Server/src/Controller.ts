import { showPopup } from './Popup.js';
import GetAllCompositeDataContainer from './GetAllCompositeDataContainer.js';
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
        (<HTMLInputElement>document.getElementById(`weekday${i}`)).checked = false;
    }
};

const insertArrayDataIntoHTMLTable = (tableId: number, data: string[][]) => {
    let maxRowLength = 0;
    for (let i = 0; i < data.length; i++) {
        maxRowLength = data[i].length > maxRowLength ? data[i].length : maxRowLength;
    }
    var table = <HTMLTableElement>document.getElementById(`table${tableId}`);
    for (var row = 0; row < data.length; row++) {
        for (var column = 0; column < data[row].length; column++) {
            table.rows[row].cells[column].innerHTML = data[row][column]
        }
    }
};

const transformHTMLTableToArray = (tableId: number): string[][] => {
    var table = <HTMLTableElement>document.getElementById(`table${tableId}`);
    var tableArray: string[][] = [];
    for (var r = 0; r < table.rows.length; r++) {
        tableArray[r] = [];
        for (var s = 0; s < table.rows[r].cells.length; s++) {
            let inner = table.rows[r].cells[s].innerHTML;
            tableArray[r][s] = inner;
        }
    }

    return tableArray;
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
    constructor(serverAddress: string) {
        this.serverAddress = serverAddress;
    }
    getHolidays = async (): Promise<boolean[]> => {
        const URL = `http://${this.serverAddress}/getHolidays`;
        return await this.get(URL);
    };
    getHTMLTable = async (): Promise<string[][]> => {
        const URL = `http://${this.serverAddress}/getHTMLTables`;
        return await this.get(URL);
    };
    getHeadLines = async (): Promise<string[]> => {
        const URL = `http://${this.serverAddress}/getHeadLines`;
        return await this.get(URL);
    };
    getAll = async (): Promise<GetAllCompositeDataContainer> => {
        const URL = `http://${this.serverAddress}/getAll`;
        return await this.get(URL);
    };

    get = async (URL: string): Promise<any> => {
        let respones = await fetch(URL);
        let result = await respones.json();
        return result;
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
        return fetch(URL, new PostParams(JSON.stringify(tableArray)));
    };

    updateHeadLines = async (): Promise<Response> => {
        let lineArray: string[] = [];
        for (let i = 0; i < 2; i++) {
            let line = <HTMLParagraphElement>document.getElementById(`line${i}`);
            lineArray.push(line.innerHTML);
        }
        const URL = `http://${this.serverAddress}/updateHeadLines`;
        return fetch(URL, new PostParams(JSON.stringify(lineArray)));
    };

    updateAll = async (): Promise<Response> => {
        let lineArray: string[] = [];
        for (let i = 0; i < 2; i++) {
            let line = <HTMLParagraphElement>document.getElementById(`line${i}`);
            lineArray.push(line.innerHTML);
        }
        let tableArray: string[][][] = [];
        for (let i = 0; i < 3; i++) {
            tableArray[i] = transformHTMLTableToArray(i);
        }
        let data = new GetAllCompositeDataContainer();
        data.HeadLines = lineArray;
        data.Holidays = this.holidays;
        data.HTMLTables = tableArray;
        const URL = `http://${this.serverAddress}/updateAll`;

        return fetch(URL, new PostParams(JSON.stringify(data)));
    };

    saveDocument = async () => {
        document.body.style.cursor = 'wait';
        let saveButton = <HTMLInputElement>document.getElementById('saveButton');
        saveButton.disabled = true;
        saveButton.style.cursor = 'wait';
        this.updateAll()
            .then((res) => {
                if (res.status === 200) {
                    showPopup('Dokument wurde gespeichert.', 1.3);
                } else {
                    alert('Es ist ein Fehler aufgetreten.');
                }
                document.body.style.cursor = 'default';
                saveButton.disabled = false;
                saveButton.style.cursor = 'default';
            })
            .catch((error) => {
                console.log(error);
                alert('Es ist ein Fehler aufgetreten.');
                document.body.style.cursor = 'default';
                saveButton.disabled = false;
                saveButton.style.cursor = 'default';
            });
    };
}

export {Controller, updateHolidayTableColors, toggleHoliday, insertArrayDataIntoHTMLTable };
