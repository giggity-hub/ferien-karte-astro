import {derived, writable, type Readable} from 'svelte/store'
export const selectedDate = writable(new Date())
import schulferien from './schulferien.json'
const holidays: HolidayData = schulferien;


export const currentHolidays = derived(selectedDate, $selectedDate => {
    const holidaysForYear = holidays[$selectedDate.getFullYear().toString()]

    const selectedDateISO = $selectedDate.toISOString().split('T')[0]
    function holidayIsCurrent(h: Holiday){
        return (h.start <= selectedDateISO) && (selectedDateISO <= h.end)
    }

    function mapActiveHolidays([bid, holidays] : [BundeslandID, Holiday[]]) : [BundeslandID, Holiday | undefined]{
        const activeHolidayOrUndefined = holidays.find(holidayIsCurrent)
        return [bid, activeHolidayOrUndefined]
    }

    // @ts-ignore
    const entries = Object.entries(holidaysForYear).map(mapActiveHolidays)

    return Object.fromEntries(entries)
})