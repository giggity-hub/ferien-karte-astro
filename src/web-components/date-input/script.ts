"use strict";

import { CustomSelect } from "../custom-select/script";

export class DateInput extends HTMLElement{
    #value: Date | undefined;

    $yearSelect: CustomSelect;
    $monthSelect: CustomSelect;
    $daySelect: CustomSelect;

    constructor(){
        super();
        const template: HTMLTemplateElement | null = document.querySelector("#date-input-template");
        if (!template) {
            throw new Error("Missing template with id 'date-input-template' for DateInput custom Element");
        }
        
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(template.content.cloneNode(true))

        this.$yearSelect = this.createInputElement('year')
        this.$monthSelect = this.createInputElement('month')
        this.$daySelect = this.createInputElement('day')

        shadow.append(this.$yearSelect, this.$monthSelect, this.$daySelect)
        

        const minYear = 2023
        const maxYear = 2025

        this.$yearSelect.options = {
            "2023": {label: "2023"},
            "2024": {label: "2024"},
            "2025": {label: "2025"}
            }
        
        const months = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
        console.log(months)
        const monthOptions = {}
        for (let index = 0; index < months.length; index++) {
            monthOptions[index] = {label: months[index]}
        }
        this.$monthSelect.options = monthOptions;

        const dayOptions = {}
        for (let index = 0; index < 30; index++) {
            dayOptions[index] = {label: index}
        }
        this.$daySelect.options = dayOptions;

        // this.$monthSelect.toggleOpen()
        // this.$yearSelect.toggleOpen()
    }

    connectedCallback(){
       
    }

    createInputElement(inputType: string): CustomSelect{
        // const customSelect = document.createElement('custom-select')
        const customSelect = new CustomSelect()
        customSelect.dataset.type = inputType;

        const listenerLookup = {
            "year": (e)=>{
                this.#value.setFullYear(e.currentTarget.value)
                this.dispatchEvent(new Event('change'))
            },
            "day": (e)=>{
                this.#value?.setDate(e.currentTarget.value)
                this.dispatchEvent(new Event('change'))
            },
            // When the Month is changed we need to check if the current date value exceeds the days in month
            // if so set the date value to the last date of selected month
            "month": (e)=>{
                const selectedMonth = parseFloat(e.currentTarget.value)
                const newDate = new Date(this.#value)
                newDate.setMonth(e.currentTarget.value)

                if (newDate.getMonth() !== selectedMonth) {
                    console.log(newDate.getMonth(), e.currentTarget.value)
                    newDate.setMonth(e.currentTarget.value);
                    console.log(newDate, 'newdate')
                    newDate.setDate(this.getNumberOfDaysInMonth(newDate))
                    console.log(newDate,' after days set')

                    console.log(this.$daySelect.options)
                }
                this.$daySelect.options = this.generateDayOptionsForDate(newDate)
                this.$daySelect.value = newDate.getDate().toString()
                
                this.#value = newDate;
                this.dispatchEvent(new Event('change'))
            }
        }

        customSelect.addEventListener('change', listenerLookup[inputType])
        return customSelect
    }

    changeEventHandler(e){
        this.#value

    }

    set value(v){
        console.log('nani', v)
        this.#value = v;
        this.render()
    }

    get value(){
        console.log('boiiiii')
        return this.#value
    }

    getNumberOfDaysInMonth(date: Date){
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        // using 0 as the Day returns the last day of the previous month
        return new Date(year, monthIndex + 1, 0).getDate()
    }

    generateDayOptionsForDate(date){
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        // using 0 as the Day returns the last day of the previous month
        const numberOfDaysInMonth = new Date(year, monthIndex + 1, 0).getDate()
        const daysOptions = {}
        // Start from 1 because days are 1-index based
        for (let i = 1; i <= numberOfDaysInMonth; i++) {
            daysOptions[i] = {label: i}
        }
        return daysOptions;
    }

    render(params) {
        console.log('boii')
        //step 1 we have year
        const dayOptions = this.generateDayOptionsForDate(this.#value)
        this.$daySelect.options = dayOptions;

        this.$yearSelect.value = this.#value.getFullYear();
        this.$monthSelect.value = this.#value.getMonth();
        this.$daySelect.value = this.#value.getDate();
    }
}
customElements.define('date-input', DateInput);
console.log('element defined')