import { DictState, State } from "./utils";
import { bundeslaender, holidays } from "./data";

export const selectedDate = new State(new Date())

const entries = bundeslaender.map(bid => [bid, null])
const defaultCurrentHolidays = Object.fromEntries(entries)
export const currentHolidays = new DictState<Holiday|undefined>(defaultCurrentHolidays)

const defaultDaysUntilEndOfCurrentHoliday = Object.fromEntries(bundeslaender.map(bid => [bid, 0]))
export const daysUntilEndOfCurrentHoliday = new DictState<number>(defaultDaysUntilEndOfCurrentHoliday)

export const mouseOverBundesland = new State<null|string>(null)

function calculateNumberOfDaysBetweenTwoDates(date1: Date, date2: Date){
    var differenceInMilliseconds = date2.getTime() - date1.getTime(); 
    const MILLISECONDS_PER_DAY = (1000 * 3600 * 24)
    // To calculate the no. of days between two dates 
    var differenceInDays = differenceInMilliseconds / MILLISECONDS_PER_DAY;
    return Math.round(differenceInDays)
}


selectedDate.subscribe((newValue) => {
    const year = newValue.getFullYear().toString()
    const selectedDateISO = newValue.toISOString().split('T')[0]

    function holidayIsCurrent(h: Holiday){
        return (h.start <= selectedDateISO) && (selectedDateISO <= h.end)
    }

    Object.entries(holidays[year]).map(([bid, holidaysForYear])=>{
        const currentHoliday = holidaysForYear.find(holidayIsCurrent)
        const previousHoliday = currentHolidays.getKey(bid)


        const daysUntil = currentHoliday ? (
            calculateNumberOfDaysBetweenTwoDates(newValue, new Date(currentHoliday.end))
        ) : 0
        daysUntilEndOfCurrentHoliday.setKey(bid, daysUntil)

        if (previousHoliday?.id != currentHoliday?.id){
            currentHolidays.setKey(bid, currentHoliday)
        }
    })
})