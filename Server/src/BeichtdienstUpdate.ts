import {Controller,insertArrayDataIntoHTMLTable,toggleHoliday,updateHolidayTableColors} from './Controller.js'


let controller = new Controller(window.location.host)

addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            // Prevent the Save dialog to open
            e.preventDefault();
            // Place your code here
            controller.saveDocument()
        }
    });
    document.getElementById("saveButton").addEventListener("click",()=>{
        controller.saveDocument()
    })
    //db.updateHTMLTables()
    controller.getHolidays().then((res) => {
        updateHolidayTableColors(res);
        controller.holidays = res;
        res.forEach((holiday:boolean,index:number) => {
            (<HTMLInputElement>document.getElementById(`weekday${index}`)).checked = holiday
        });
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
    for(let i = 0; i < 7;i++){
        let button = document.getElementById(`weekday${i}`)
        button.addEventListener("click",()=>{
            if(i == 6){
                toggleHoliday(-1,controller)
            }
            else{
                toggleHoliday(i,controller)
            }
        })
    }
});