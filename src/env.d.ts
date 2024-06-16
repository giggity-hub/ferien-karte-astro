/// <reference types="astro/client" />

type BundeslandID = 'BW'|'BY'|"BE"|"BB"|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH'

interface Bundesland {
    name: string,
    coatOfArms: string,
    id: BundeslandID
}

interface Holiday{
    holiday_type: string;
    start: string;
    end: string;
    id: string;
    bundesland: Bundesland
}


interface BundeslandData{
    name: string;
}

type Bundeslaender = Record<BundeslandID, BundeslandData>

type HolidaysForYear = Record<BundeslandID, Holiday[]>
type HolidayData = Record<string, HolidaysForYear>

const sheesh = ['2345', 'dddd']