export {};

interface State {
    holidays: boolean[];
}
declare global {
    interface globalThis {
        db: any;
        state: State;
        updateHolidayTableColors: CallableFunction
        toggleHoliday: CallableFunction
        insertArrayDataIntoHTMLTable: CallableFunction
    }
}
