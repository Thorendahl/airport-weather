export type WeatherReport = {
    ident: string;
    metar: Metar;
    taf: Metar[];
}

export type Metar = {
    date: Date;
    text: string;
    wind: string;
    visibility: string;
    clouds: string;
    temperature: string,
    dewpoint: string,
    altimeter: string,
    humidity: string,
    flightRules: string,
    densityAltitude: string,
    expire?: Date;
}


