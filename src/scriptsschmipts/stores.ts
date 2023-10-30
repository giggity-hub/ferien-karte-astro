import Alpine from "alpinejs";

const bundeslaender = ['BW', 'BY',"BE","BB",'HB','HH','HE','MV','NI','NW','RP','SL','SN','ST','SH','TH']

import { holidays } from "../data";


Alpine.data('appdata', ()=>({
    selectedDate: new Date().toISOString().split('T')[0],
    currentHolidayIn: Object.fromEntries(bundeslaender.map(id => [id, null])) as Record<string, null|Holiday>,

    init(){
        this.$watch('selectedDate', this.updateCurrentHolidays.bind(this))
    },
    updateCurrentHolidays(dateIsoString: string){
        function holidayIsCurrent(h: Holiday){
            return (h.start <= dateIsoString) && (dateIsoString <= h.end)
        }
    
        const year = dateIsoString.slice(0, 4)
    
        Object.entries(holidays[year]).map(([bid, holidaysForYear])=>{
            const currentHoliday = holidaysForYear.find(holidayIsCurrent)
            const previousHoliday = this.currentHolidayIn[bid]
            if (previousHoliday?.start != currentHoliday?.start){
                console.log(currentHoliday);
                this.$dispatch('currentHolidayIn', {
                    bundesland: bid,
                    newVal: currentHoliday,
                    oldVal: previousHoliday,
                })
                this.currentHolidayIn[bid] = currentHoliday || null
            }
        })
        // return Object.fromEntries(bundeslaender.map(id => [id, null]))
    }
}))


