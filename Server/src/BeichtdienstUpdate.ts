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
    //Uncomment next line if you want to reset db to default values
    //controller.saveDocument()
    
    controller.getAll().then((res)=>{
        console.log(`getAll result from database:`)
        console.log(res)
        //Insert Holidays
        updateHolidayTableColors(res.Holidays);
        controller.holidays = res.Holidays;
        res.Holidays.forEach((holiday:boolean,index:number) => {
            (<HTMLInputElement>document.getElementById(`weekday${index}`)).checked = holiday
        });

        //Insert Tables
        for (let i = 0; i < res.HTMLTables.length; i++) {
            insertArrayDataIntoHTMLTable(i, res.HTMLTables[i]);
        }

        //Insert Headlines
        for (let i = 0; i < res.length; i++) {
            document.getElementById(`line${i}`).innerHTML = res[i];
        }
    })
    

    //Asigning EventListeners for Holiday RadioButtons
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