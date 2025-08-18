import {Component, computed, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {formatDistanceStrict} from 'date-fns'
import { Metar } from '../../domain/models/weather.model';

@Component({
    selector: 'app-metar',
    imports: [
        DatePipe
    ],
    templateUrl: './metar.component.html',
    styleUrl: './metar.component.scss'
})
export class MetarComponent {

    metar = input.required<Metar | undefined>();
    ident = input<string | undefined>();
    timeDistance = computed(() => formatDistanceStrict(this.metar()!.date, new Date(), {unit: 'minute', addSuffix: true}))

}
