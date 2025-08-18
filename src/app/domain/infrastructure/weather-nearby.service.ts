import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WeatherNearbyService {

    //nearbyAirports1 = new map<string, string>([]);
    private readonly nearbyWeather = new Map<string, string>([
        ['EKBI', 'EKYT'],
        ['KMAI', 'KMIA'],
        ['LEMD', 'LEMG'],
    ]);

    getNearbyAirport = (icaoCode: string): string => this.nearbyWeather.get(icaoCode.toUpperCase())!;
    hasNearbyAirport = (icaoCode: string): boolean => this.nearbyWeather.has(icaoCode.toUpperCase());
}
