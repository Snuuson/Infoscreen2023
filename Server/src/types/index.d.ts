export {};

interface State {
    holidays: boolean[];
}
declare global {
    interface globalThis {
        Database: any;
        state: State;
        updateHolidayTableColors: CallableFunction
        toggleHoliday: CallableFunction
        insertArrayDataIntoHTMLTable: CallableFunction
    }
}
