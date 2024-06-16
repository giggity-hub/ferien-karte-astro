import IntervalTree from "@flatten-js/interval-tree";
import '../../node_modules/normalize.css/normalize.css'
import {DateInput} from "../web-components/date-input/script"
import type { ScrollableRangeInput } from "../web-components/scrollable-range-input/script";
import { bundeslandData, holidays, bundeslaender } from "./data";

class App{
    selectedBundesland: BundeslandID | null = null;
    maxDate: Date;
    minDateTimeStamp: number;
    maxDateTimeStamp: number;
    selectedDateTimeStamp: number;
    selectedDateIso: string;
    constructor(){
        this.maxDate = new Date(2025, 11, 31)
        this.minDateTimeStamp = +new Date(2023, 0, 1)
        this.maxDateTimeStamp = +this.maxDate
        this.selectedDateTimeStamp = Math.min(this.maxDateTimeStamp, + new Date())
        this.selectedDateIso = new Date(this.selectedDateTimeStamp).toISOString().split('T')[0]
    }
}

export const app = new App();


function addHoverListeners(){
    let hoveredBundeslandElements: HTMLElement[] = []

    function mouseLeaveHandler(e: MouseEvent){
        hoveredBundeslandElements.forEach($el => $el.classList.remove('is-hover'))
    }

    function mouseEnterHandler(e: MouseEvent){
        if (hoveredBundeslandElements) {
            mouseLeaveHandler(e)
        }

        if (e.currentTarget && e.currentTarget instanceof HTMLElement || e.currentTarget instanceof SVGElement) {
            const bid = e.currentTarget.dataset.bundesland
            hoveredBundeslandElements = Array.from(document.querySelectorAll(`[data-bundesland=${bid}]`))
            hoveredBundeslandElements.forEach($el=> $el.classList.add('is-hover'))
        }
    }
    
    const $bundeslandDataStuff = Array.from(document.querySelectorAll(`[data-bundesland]`)) as HTMLElement[]
    $bundeslandDataStuff.forEach($el =>{
        $el.addEventListener('mouseenter', mouseEnterHandler)
        $el.addEventListener('mouseleave', mouseLeaveHandler)
    })
}


const tree = new IntervalTree<Holiday>()
holidays.forEach(h =>{
    const start = +new Date(h.start)
    const end = +new Date(h.end)
    tree.insert([start, end], h)
})


function main(){

    addHoverListeners();



    const $tooltip = document.getElementById('tooltip') as BoundedTooltip;
    


    

    const $di: DateInput = document.querySelector('#date-input-custom')
    const $rangeInput: ScrollableRangeInput = document.getElementById('my-range-input')

    $di.value = new Date(app.selectedDateTimeStamp)

    $rangeInput.min = app.minDateTimeStamp;
    $rangeInput.max = app.maxDateTimeStamp;
    $rangeInput.value = app.selectedDateTimeStamp;

    // $rangeInput?.setAttribute('min', app.minDateTimeStamp.toString())
    // $rangeInput?.setAttribute('max', app.maxDateTimeStamp.toString())
    // $rangeInput?.setAttribute('value', (app.selectedDateTimeStamp).toString())



$rangeInput?.addEventListener('change', (e)=>{
    $tooltip.hide()
    console.log($di.value)
    $di.value = new Date(e.target.value)
    updateShit(e.target.value)
})



$di?.addEventListener('change', (e)=>{
    const dateTimeStamp = + new Date(e.target.value);
    $rangeInput.value = dateTimeStamp
    updateShit(dateTimeStamp)
})
}


document.addEventListener('DOMContentLoaded', main)


let currentHolidays = [];
let currentBundeslaender = [];



export const holidaysForBundesLand = Object.fromEntries(bundeslaender.map(bid => [bid, null])) as Record<BundeslandID, Holiday|null>

function setValuesToNull(obj: object) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = null;
        }
    }
}


function updateShit(dateTimeStamp){
    const res = tree.search([dateTimeStamp, dateTimeStamp])

    const activeHolidayIDs = new Set()
    const activeBundeslandIDs = new Set()

    function callback(holiday: Holiday){
        activeHolidayIDs.add(holiday.id)
        activeBundeslandIDs.add(holiday.bundesland.id)
        holidaysForBundesLand[holiday.bundesland.id] = holiday
    }

    
    setValuesToNull(holidaysForBundesLand)
    res.forEach(callback)

    

    currentHolidays.forEach($el => {
        $el.classList.remove('is-current-holiday')
    })
    currentHolidays = []

    activeHolidayIDs.forEach(hid => {
        const $holidays = document.querySelectorAll(`[data-holiday-id="${hid}"]`)
        $holidays.forEach($h => $h.classList.add('is-current-holiday'))
        currentHolidays.push(...$holidays)
    })


    // set bids
    currentBundeslaender.forEach($el => {
        $el.classList.remove('has-current-holiday')
    })
    currentBundeslaender = []

    activeBundeslandIDs.forEach(bid =>{
        const $bundslndr = document.querySelectorAll(`[data-bundesland="${bid}"]`)
        // console.log($bundslndr)
        $bundslndr.forEach($b => $b.classList.add('has-current-holiday'))
        currentBundeslaender.push(...$bundslndr)
    })
}


