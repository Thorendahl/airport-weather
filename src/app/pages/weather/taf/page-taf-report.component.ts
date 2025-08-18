import {Component, computed, inject} from '@angular/core';
import {WeatherFacade} from '../../../domain/application/weather.facade';
import {TafComponent} from '../../../ui/taf/taf.component';

@Component({
    selector: 'app-taf-page',
    imports: [
        TafComponent
    ],
    templateUrl: './page-taf-report.component.html',
    styleUrl: './page-taf-report.component.scss'
})
export class PageTafReport {
    protected error = computed(() => this.view().error);
    protected hasError = computed(() => this.error() !== null);
    private readonly facade = inject(WeatherFacade)
    protected view = computed(() => this.facade.state());
    protected tafReport = computed(() => this.facade.state().report?.taf);
    protected hasTafReport = computed(() => this.facade.state().report?.taf !== null);
}
