import {Database,State,insertArrayDataIntoHTMLTable,toggleHoliday,updateHolidayTableColors} from './main.js'


let state = new State()
let db = new Database(window.location.host,state)

addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            // Prevent the Save dialog to open
            e.preventDefault();
            // Place your code here
            db.saveDocument()
        }
    });
    document.getElementById("saveButton").addEventListener("click",()=>{
        db.saveDocument()
    })
    //db.updateHTMLTables()
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
    for(let i = 0; i < 7;i++){
        let button = document.getElementById(`weekday${i}`)
        button.addEventListener("click",()=>{
            if(i == 6){
                toggleHoliday(-1)
            }
            else{
                toggleHoliday(i)
            }
        })
    }
});