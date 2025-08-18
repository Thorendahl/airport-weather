import {inject, Injectable, signal} from '@angular/core';
import {WeatherService} from '../infrastructure/weather.service';
import {WeatherNearbyService} from '../infrastructure/weather-nearby.service';
import {StateModel} from '../models/state.model';
import {catchError, EMPTY} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherFacade {

    public readonly state = signal<StateModel>(new StateModel());
    private readonly weatherService = inject(WeatherService);
    private readonly nearbyWeatherService = inject(WeatherNearbyService);

    getWeatherByIcaoCode(icaoCode: string) {

        if (icaoCode === this.state().icaoCode) {
            return
        }

        this.resetWeatherState();
        this.weatherService.getWeatherByIcaoCode(icaoCode)
            .pipe(catchError((err, caught) => {
                throw new Error(`Unable to get weather from "${icaoCode}"`);
            }))
            .subscribe({
                    next: value => {
                        this.addToHistory(icaoCode);
                        this.state.set({...this.state(), report: value, nearbyReport: null, icaoCode: icaoCode, error: null});
                    },
                    error: err => {
                        if (!this.nearbyWeatherService.hasNearbyAirport(icaoCode)) {
                            this.showError(new Error(`${err.message.replace('Error:', '')}`, {cause: err}));
                        }
                    }
                }
            );

        if (this.nearbyWeatherService.hasNearbyAirport(icaoCode)) {
            this.weatherService.getWeatherByIcaoCode(this.nearbyWeatherService.getNearbyAirport(icaoCode))
                .subscribe(value => this.state.set({...this.state(), nearbyReport: [value], error: null}));
        }
    }

    resetWeatherState = () => this.state.set({...this.state(), report: null, nearbyReport: null, icaoCode: '', error: null});

    showError(error: Error) {
        //this.nearbyWeatherService.hasNearbyAirport()
        this.state.update(value => ({...value, error: error.message, report: null, icaoCode: ''}));
        console.error("MyError", error);
        return EMPTY;
    }

    addToHistory(icao: string) {
        const icaoHistory = this.state().history;
        const newHistory = icaoHistory.filter(f => f !== icao).concat([icao]);
        this.state.set({...this.state(), history: newHistory});

    }
}
