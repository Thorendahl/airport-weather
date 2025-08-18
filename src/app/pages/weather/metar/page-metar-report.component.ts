import {Component, computed, inject} from '@angular/core';
import {WeatherFacade} from '../../../domain/application/weather.facade';
import {MetarComponent} from '../../../ui/metar/metar.component';

@Component({
    selector: 'app-metar-page',
    templateUrl: './page-metar-report.component.html',
    imports: [
        MetarComponent
    ],
    styleUrl: './page-metar-report.component.scss'
})
export class PageMetarReportComponent {

    protected hasError = computed(() => this.error() !== null);
    protected icaoCode = computed(() => this.view().icaoCode);
    protected report = computed(() => this.view().report);
    protected hasReport = computed(() => this.report() !== null);
    protected nearbyReport = computed(() => this.view().nearbyReport);
    protected hasNearbyReport = computed(() => this.nearbyReport() !== null);
    private readonly facade = inject(WeatherFacade);
    protected view = computed(() => this.facade.state());
    protected error = computed(() => this.view().error);

}
