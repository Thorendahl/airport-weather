import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {WeatherAdapter} from './weather.adapter';
import {WeatherCacheService} from './weather-cache/weather-cache.service';
import {WeatherReport} from '../models/weather.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private readonly _http = inject(HttpClient);
    private readonly _cache = inject(WeatherCacheService);
    private readonly _headers = new HttpHeaders().set('x-foreflight-odense', 'true');

    getWeatherByIcaoCode(icaoCode: string): Observable<WeatherReport> {

        // Check cache first
        const cachedData = this._cache.get(icaoCode);
        if (cachedData) {
            return of(cachedData);
        }

        // If not in cache, fetch from API
        return this._http.get(`/weather/report/${icaoCode}`, {headers: this._headers})
            .pipe(
                map((response: any) => {
                    const weatherReport = WeatherAdapter.adaptWeatherReport(response);
                    // Cache the result
                    this._cache.set(icaoCode, weatherReport);
                    return weatherReport;
                }),
                catchError(error => throwError(() => error))
            );
    }

    /**
     * Force refresh weather data by bypassing cache
     * @param icaoCode The ICAO airport code
     * @returns Observable of fresh weather report
     */
    refreshWeatherByIcaoCode(icaoCode: string): Observable<WeatherReport> {
        // Remove from cache first
        this._cache.delete(icaoCode);
        return this._http.get(`/weather/report/${icaoCode}`, {headers: this._headers})
            .pipe(
                map((response: any) => {
                    const weatherReport = WeatherAdapter.adaptWeatherReport(response);
                    // Cache the fresh result
                    this._cache.set(icaoCode, weatherReport);
                    return weatherReport;
                }),
                catchError(error => throwError(() => error))
            );
    }

    clearCache = (icaoCode: string): void => this._cache.delete(icaoCode);
    clearAllCache = (): void => this._cache.clear();
    getCacheStats = () => this._cache.getStats();
}
