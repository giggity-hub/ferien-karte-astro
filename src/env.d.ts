/// <reference types="astro/client" />

interface Holiday{
    holiday_type: string;
    start: string;
    end: string;
    id: string;
}

type BundeslandID = 'BW'|'BY'|"BE"|"BB"|'HB'|'HH'|'HE'|'MV'|'NI'|'NW'|'RP'|'SL'|'SN'|'ST'|'SH'|'TH'

interface BundeslandData{
    name: string;
}

type Bundeslaender = Record<BundeslandID, BundeslandData>

type HolidaysForYear = Record<BundeslandID, Holiday[]>
type HolidayData = Record<string, HolidaysForYear>

const sheesh = ['2345', 'dddd']