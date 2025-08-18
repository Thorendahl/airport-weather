import {Component, computed, inject} from '@angular/core';
import {WeatherFacade} from '../../../domain/application/weather.facade';
import {TafComponent} from "../../../ui/taf/taf.component";
import {MetarComponent} from '../../../ui/metar/metar.component';

@Component({
    selector: 'app-full',
    imports: [
        TafComponent,
        MetarComponent
    ],
    templateUrl: './page-full-report.component.html',
    styleUrl: './page-full-report.component.scss'
})
export class PageFullReport {
    protected hasError = computed(() => this.error() !== null);
    protected report = computed(() => this.view().report);
    protected hasReport = computed(() => this.report() !== null);
    private readonly facade = inject(WeatherFacade)
    protected view = computed(() => this.facade.state());
    protected icaoCode = computed(() => this.view().icaoCode);
    protected error = computed(() => this.view().error);
    protected tafReport = computed(() => this.facade.state().report?.taf);
    protected hasTafReport = computed(() => this.facade.state().report?.taf !== null);

}
