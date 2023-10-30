const bundeslaender = ['BW', 'BY',"BE","BB",'HB','HH','HE','MV','NI','NW','RP','SL','SN','ST','SH','TH']

import { currentHolidays } from "../customstore";
import { holidays } from "../data";
import { State, DictState } from "../utils";

function dateToYYYYMMDD(d: Date){
    return d.toISOString().split('T')[0]
}


const handler = {
    set(obj, prop, value){
        
        return Reflect.set(obj, prop, value)
    },
    get(obj, prop, receiver){
        return Reflect.get(obj, prop, receiver)
    }
}

function reactive(initialValue){
    return new Proxy(initialValue, handler)
}

class AppState{
    $hoveredBundeslandId: State<string|null> = new State(null)
    $selectedDate: State<Date> = new State(new Date())
    $currentHolidayIn = new DictState({})

    years

    constructor(holidays: HolidayData){
        this.years = Object.keys(holidays).toSorted().map(x => parseInt(x))
        this.$selectedDate.listen(this.calculateCurrentHolidays.bind(this))
    }
    calculateCurrentHolidays(d: Date){
        const dateIsoString = dateToYYYYMMDD(d)
        const year = dateIsoString.slice(0, 4)
        function holidayIsCurrent(h: Holiday){
            return (h.start <= dateIsoString) && (dateIsoString <= h.end)
        }
    
        Object.entries(holidays[year]).map(([bid, holidaysForYear])=>{
            const currentHoliday = holidaysForYear.find(holidayIsCurrent)
            this.$currentHolidayIn.setKey(bid, currentHoliday)
        })
    }

}


export const app = new AppState(holidays)