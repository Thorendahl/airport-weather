import {Component, computed, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Metar} from '../../domain/models/weather.model';

@Component({
    selector: 'app-taf',
    imports: [
        DatePipe
    ],
    templateUrl: './taf.component.html',
    styleUrl: './taf.component.scss'
})
export class TafComponent {

    report = input.required<Metar[] | undefined>();
    ident = input.required<string>();
    tafText = computed(() => this.report()?.map(report => report.text).join(', '))

}
