import { WeatherReport, Metar } from '../models/weather.model';

export abstract class WeatherAdapter {

    static adaptWeatherReport(model: any) {
        return {
            ident: model.report.conditions.ident.toUpperCase(),
            metar: this.adaptMetar(model.report.conditions),
            taf: this.adaptTaf(model.report.forecast.conditions),
        } satisfies WeatherReport
    }

    static adaptMetar(model: any): Metar {

        const adaptWind = (model: any) => `${model.direction ? model.direction + '° in' : ''} ${model.speedKts.toFixed(2)} kts`;
        const adaptVisibility = (model: any) => `${model.distanceSm} SM`;
        const adaptTemperature = (model: any) => `${model}°C (${(model * 9 / 5) + 32}° F)`
        const adaptClouds = (model: any) => {
            return `${staticCloudMap.get(model[0].coverage)} ${model.coverage === 'ncd' ? model[0].altitudeFt + "'" : ''}`;
        };

        return {
            text: model.text.replace('METAR', ''),
            date: new Date(model.dateIssued),
            wind: adaptWind(model.wind),
            visibility: adaptVisibility(model.visibility),
            clouds: Array.isArray(model.cloudLayers) && model.cloudLayers.length ? adaptClouds(model.cloudLayers) : adaptClouds(model.cloudLayersV2),
            temperature: adaptTemperature(model.tempC),
            dewpoint: adaptTemperature(model.dewpointC),
            flightRules: model.flightRules.toString(),
            humidity: model.relativeHumidity,
            altimeter: model.pressureHg,
            densityAltitude: model.densityAltitudeFt,
            expire: model.period ? new Date(model.period.dateEnd) : undefined,
        } satisfies Metar
    }

    static adaptTaf(model: any[]) {
        return model.map(condition => this.adaptMetar(condition));
    }
}

const staticCloudMap = new Map<string, string>();
staticCloudMap.set('clr', 'Clear');
staticCloudMap.set('ncd', 'No clouds detected');
staticCloudMap.set('few', 'Few clouds');
staticCloudMap.set('bkn', 'Broken clouds');
staticCloudMap.set('sct', 'Scattered clouds');
staticCloudMap.set('ovc', 'Overcast');
staticCloudMap.set('skc', 'Sky clear');
staticCloudMap.set('cavok', 'Ceiling and Visibility OK');
