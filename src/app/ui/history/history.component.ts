import {Component, computed, inject} from '@angular/core';
import {WeatherFacade} from '../../domain/application/weather.facade';
import {Router} from '@angular/router';

@Component({
    selector: 'app-history',
    imports: [],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss'
})
export class HistoryComponent {

    private readonly facade = inject(WeatherFacade);
    protected readonly history = computed(() => this.facade.state().history)
    private readonly router = inject(Router);

    loadWeather = async (icao: string) => {
        this.facade.getWeatherByIcaoCode(icao);
        await this.router.navigate(['/weather/metar']);
    }
}
