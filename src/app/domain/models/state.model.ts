import { WeatherReport } from './weather.model';

export class StateModel {

    public icaoCode: string = '';
    public report: WeatherReport | null = null;
    public nearbyReport: WeatherReport[] | null = null;
    public error: string | null = null;
    public history: string[] = [];
}
