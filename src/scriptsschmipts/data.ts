import schulferien from '../schulferien.json'

export const bundeslaender = ['BW', 'BY',"BE","BB",'HB','HH','HE','MV','NI','NW','RP','SL','SN','ST','SH','TH']

const bundeslandNames = {
    "BW":  "Baden-Württemberg",
    "BY":  "Bayern",
    "BE":  "Berlin",
    "BB":  "Brandenburg",
    "HB":  "Bremen",
    "HH":  "Hamburg",
    "HE":  "Hessen",
    "MV":  "Mecklenburg-Vorpommern",
    "NI":  "Niedersachsen",
    "NW":  "Nordrhein-Westfalen",
    "RP":  "Rheinland-Pfalz",
    "SL":  "Saarland",
    "SN":  "Sachsen",
    "ST":  "Sachsen-Anhalt",
    "SH":  "Schleswig-Holstein",
    "TH":  "Thüringen"
}

type Bundesland = {
    name: string,
    coatOfArms: string,
    id: BundeslandID,
    currentHoliday: Holiday|null
}

function generateBundeslandData(): Record<BundeslandID, Bundesland> {
    const res: Record<BundeslandID, Bundesland> = {} as Record<BundeslandID, Bundesland>;
    (Object.entries(bundeslandNames) as [BundeslandID, string][]).forEach(([bid, name]) => {
        res[bid] = {
            id: bid,
            name,
            coatOfArms: `./coat-of-arms/${bid}.svg`,
            currentHoliday: null
        };
    });
    return res;
}

type Bundeslaender = Record<BundeslandID, Bundesland>

export const bundeslandData: Bundeslaender = generateBundeslandData();



export const holidayLookup: {[hid: string]: Holiday} = {}
export const holidays: Holiday[] = []

function constructHolidays(){
    for (const [year, holidaysForYear] of Object.entries(schulferien)) {
        for (const [bundesland, holidaysByYearAndBundesland] of Object.entries(holidaysForYear)){
            for (const holiday of holidaysByYearAndBundesland) {
                holiday.bundesland = bundeslandData[bundesland]
                holidayLookup[holiday.id] = holiday;
                holidays.push(holiday)

            }
        }
    }
}
constructHolidays()