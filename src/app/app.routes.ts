import {Routes} from '@angular/router';
import {PageFullReport, PageMetarReportComponent, PageTafReport, WeatherComponent} from './pages/weather';

export const routes: Routes = [
    {path: '', redirectTo: 'weather', pathMatch: 'full'},
    {
        path: 'weather',
        component: WeatherComponent,
        children: [
            {path: 'metar', component: PageMetarReportComponent},
            {path: 'taf', component: PageTafReport},
            {path: 'full', component: PageFullReport}
        ]
    },
];

