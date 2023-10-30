const bundeslaender = ['BW', 'BY',"BE","BB",'HB','HH','HE','MV','NI','NW','RP','SL','SN','ST','SH','TH']

import { currentHolidays } from "../customstore";
import { holidays } from "../data";
import { State, DictState } from "../utils";

function dateToYYYYMMDD(d: Date){
    return d.toISOString().split('T')[0]
}

// const holidaysSorted = 

class AppState{
    $hoveredBundeslandId: State<string|null> = new State(null)
    $selectedDate: State<Date> = new State(new Date())
    $currentHolidayIn = new DictState({})

    years

    constructor(holidays: HolidayData){
        // this.years = Object.keys(holidays).toSorted().map(x => parseInt(x))
        this.years = [2023, 2024, 2025]
        this.$selectedDate.listen(this.calculateCurrentHolidays.bind(this))
    }
    calculateCurrentHolidays(d: Date){
        const dateIsoString = dateToYYYYMMDD(d)
        const year = dateIsoString.slice(0, 4)
        function holidayIsCurrent(h: Holiday){
            return (h.start <= dateIsoString) && (dateIsoString <= h.end)
        }
    
        Object.entries(holidays[year]).map(([bid, holidaysForYear])=>{
            let currentHoliday = holidaysForYear.find(holidayIsCurrent)

            const newMonthIsJanuary = d.getMonth() === 0;
            const newYearIsNotFirstYear = d.getFullYear() != this.years[0]
            if ( newMonthIsJanuary && newYearIsNotFirstYear ) {
                const prevYear = (d.getFullYear() - 1).toString()
                currentHoliday = currentHoliday || holidays[prevYear][bid].find(holidayIsCurrent)
            }
            this.$currentHolidayIn.setKey(bid, currentHoliday)
        })
    }

}


export const app = new AppState(holidays)