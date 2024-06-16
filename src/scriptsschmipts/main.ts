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


    $rangeInput?.addEventListener('change', (e)=>{
        $tooltip.hide()
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


function setAllCurrentHolidaysToNull(b: Bundeslaender) {
    Object.values(b).forEach(b=>{
        b.currentHoliday = null;
    })
}


function groupedClassToggle<T>(toggleClass: string, queryGenerator: (el:T) => string){
    // Constructs a Function that does the following
    // Given a list of Objects apply a CSS Class to all elements who correspond to those objects (as specified by queryGenerator)
    // Remove the CSS Class where previously applied
    let elementsWithClassAdded: (HTMLElement | SVGElement)[] = []

    return (activeElements: T[])=>{
        elementsWithClassAdded.forEach($el => {$el.classList.remove(toggleClass)})
        elementsWithClassAdded = []
        
        activeElements.forEach(el =>{
            const query = queryGenerator(el)
            const $nodes = document.querySelectorAll(query) as NodeListOf<HTMLElement|SVGElement>
            $nodes.forEach($b => $b.classList.add(toggleClass))
            elementsWithClassAdded.push(...$nodes)
        })
    }
}

const styleBundeslaenderWithCurrentHoliday = groupedClassToggle<Bundesland>('has-current-holiday', (b:Bundesland)=> `[data-bundesland="${b.id}"]`)
const styleCurrentHolidays = groupedClassToggle<Holiday>('is-current-holiday', (b:Holiday)=> `[data-holiday-id="${b.id}"]`)

function updateShit(dateTimeStamp: number){
    const res = tree.search([dateTimeStamp, dateTimeStamp])

    const currentHolidays: Holiday[] = []
    const bundeslaenderWithCurrentHoliday: Bundesland[] = []

    function callback(holiday: Holiday){
        currentHolidays.push(holiday)
        bundeslaenderWithCurrentHoliday.push(holiday.bundesland)
        holiday.bundesland.currentHoliday = holiday;
    }
    res.forEach(callback)

    styleBundeslaenderWithCurrentHoliday(bundeslaenderWithCurrentHoliday)
    styleCurrentHolidays(currentHolidays)

    setAllCurrentHolidaysToNull(bundeslandData)
    res.forEach(callback)
}


