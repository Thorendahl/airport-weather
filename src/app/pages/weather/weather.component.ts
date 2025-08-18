import {Component, computed, inject, signal} from '@angular/core';
import {NavigationComponent} from '../../ui/navigation/navigation.component';
import {Router, RouterOutlet} from '@angular/router';
import {SearchComponent} from '../../ui/search/search.component';
import {WeatherFacade} from '../../domain/application/weather.facade';
import {HistoryComponent} from '../../ui/history/history.component';

@Component({
    selector: 'app-weather',
    imports: [
        NavigationComponent,
        RouterOutlet,
        SearchComponent,
        HistoryComponent
    ],
    templateUrl: './weather.component.html',
    styleUrl: './weather.component.scss'
})
export class WeatherComponent {
    protected readonly title = signal('Airport Weather');
    protected hasReport = computed(() => this.view().report === null)
    private readonly router = inject(Router);
    private readonly facade = inject(WeatherFacade);
    protected view = computed(() => this.facade.state());
    protected error = computed(() => this.view().error);

    searchForWeather = async (icaoCode: string) => {
        this.facade.getWeatherByIcaoCode(icaoCode);
        await this.router.navigate(['/weather/metar']);
    };

    navigateTo = async () => {
        this.facade.resetWeatherState();
        await this.router.navigate(['/']);
    };
}
