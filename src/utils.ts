import * as d3 from 'd3'

export function clamp(min: number, max: number, number: number) {
    return Math.min(Math.max(number, min), max);
};

export function dateToPercentageOfYearFactory(year: string){
    const yearInt = parseInt(year)
    const firstDateOfYear = new Date(yearInt, 0, 1)
    const lastDateOfYear = new Date(yearInt, 11, 31)

    const scale = d3.scaleTime().range([0,100]).domain([firstDateOfYear, lastDateOfYear])
    return scale
}

type StateCallback<T> = (newValue: T, oldValue: T) => void

export class State<T>{
    _value: T
    _subscribers: StateCallback<T>[] = []
    constructor(initialValue:T){
        this._value = initialValue
    }
    subscribe(callback: StateCallback<T>){
        this._subscribers.push(callback)
    }
    listen(callback: StateCallback<T>){
        this._subscribers.push(callback)
        callback(this._value, this._value)
    }
    unsubscribe(callback: StateCallback<T>){
        this._subscribers = this._subscribers.filter(cb => cb != callback)
    }
    get value(){
        return this._value
    }
    set value(newValue){
        const oldValue = this._value
        this._subscribers.forEach(cb => cb(newValue, oldValue))
        this._value = newValue
    }
}

type DictStateCallback<T> = (newValue: T, oldValue: T, key: string) => void

export class DictState<T>{
    _dict: Record<string, T>
    _subscribers: DictStateCallback<T>[] = []
    constructor(initial_value: Record<string, T>){
        this._dict = initial_value
    }
    setKey(key: string, newValue: T){
        const oldValue = this._dict[key]
        this._subscribers.forEach(cb => cb(newValue, oldValue, key))
        this._dict[key] = newValue
    }
    getKey(key: string){
        return this._dict[key]
    }
    subscribe(callback: DictStateCallback<T>){
        this._subscribers.push(callback)
    }
    unsubscribe(callback: DictStateCallback<T>){
        this._subscribers = this._subscribers.filter(cb => cb != callback)
    }
}