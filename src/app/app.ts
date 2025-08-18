import {Component, computed, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {WeatherFacade} from './domain/application/weather.facade';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('Airport Weather');
    protected error = computed(() => this.view().error);
    private readonly facade = inject(WeatherFacade);
    protected view = computed(() => this.facade.state());

    closeModal = () => this.facade.resetWeatherState();
}
