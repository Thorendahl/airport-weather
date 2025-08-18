import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {WeatherService} from './weather.service';
import {WeatherAdapter} from './weather.adapter';
import {provideZonelessChangeDetection} from '@angular/core';

describe('WeatherService', () => {
    let service: WeatherService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                WeatherService,
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(WeatherService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make HTTP GET request with correct headers and URL', () => {
        const icaoCode = 'KJFK';
        const mockResponse = {
            report: {
                conditions: {
                    ident: 'KJFK',
                    text: 'METAR KJFK 123456Z 36010KT 10SM CLR 20/10 A3000',
                    dateIssued: new Date('2024-01-01T12:00:00Z'),
                    wind: {direction: 360, speedKts: 10},
                    visibility: {distanceSm: 10},
                    tempC: 20,
                    dewpointC: 10,
                    cloudLayers: [{coverage: 'clr', altitudeFt: 5000}],
                    flightRules: 'VFR',
                    relativeHumidity: 50,
                    pressureHg: 30.00,
                    densityAltitudeFt: 1000
                },
                forecast: {
                    conditions: []
                }
            }
        };

        service.getWeatherByIcaoCode(icaoCode).subscribe(response => {
            expect(response).toBeDefined();
            expect(response.ident).toBe('KJFK');
        });

        const req = httpMock.expectOne(`/weather/report/${icaoCode}`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('x-foreflight-odense')).toBe('true');
        req.flush(mockResponse);
    });

    it('should handle HTTP errors correctly', () => {
        const icaoCode = 'INVALID';
        const mockError = {status: 404, statusText: 'Not Found'};

        service.getWeatherByIcaoCode(icaoCode).subscribe({
            next: () => {
                throw new Error('should have failed');
            },
            error: (error) => {
                expect(error.status).toBe(mockError.status);
                expect(error.statusText).toBe(mockError.statusText);
            }
        });

        const req = httpMock.expectOne(`/weather/report/${icaoCode}`);
        req.flush('Not Found', mockError);
    });

    it('should call WeatherAdapter.adaptWeatherReport with response data', () => {
        const icaoCode = 'KLAX';
        const mockResponse = {
            report: {
                conditions: {
                    ident: 'KLAX',
                    text: 'METAR KLAX 123456Z 27015KT 10SM FEW250 25/15 A2992',
                    dateIssued: new Date('2024-01-01T12:00:00Z'),
                    wind: {direction: 270, speedKts: 15},
                    visibility: {distanceSm: 10},
                    tempC: 25,
                    dewpointC: 15,
                    cloudLayers: [{coverage: 'few', altitudeFt: 25000}],
                    flightRules: 'VFR',
                    relativeHumidity: 60,
                    pressureHg: 29.92,
                    densityAltitudeFt: 1200
                },
                forecast: {
                    conditions: []
                }
            }
        };

        service.getWeatherByIcaoCode(icaoCode).subscribe(response => {
            // Verify the response was properly adapted by checking the structure
            expect(response).toBeDefined();
            expect(response.ident).toBe('KLAX');
            expect(response.metar).toBeDefined();
            expect(response.taf).toBeDefined();
        });

        const req = httpMock.expectOne(`/weather/report/${icaoCode}`);
        req.flush(mockResponse);
    });

    it('should handle different ICAO codes correctly', () => {
        const icaoCodes = ['KJFK', 'KLAX', 'EGLL', 'LFPG'];

        icaoCodes.forEach((icaoCode) => {
            const mockResponse = {
                report: {
                    conditions: {
                        ident: icaoCode,
                        text: `METAR ${icaoCode} 123456Z 36010KT 10SM CLR 20/10 A3000`,
                        dateIssued: new Date('2024-01-01T12:00:00Z'),
                        wind: {direction: 360, speedKts: 10},
                        visibility: {distanceSm: 10},
                        tempC: 20,
                        dewpointC: 10,
                        cloudLayers: [{coverage: 'clr', altitudeFt: 5000}],
                        flightRules: 'VFR',
                        relativeHumidity: 50,
                        pressureHg: 30.00,
                        densityAltitudeFt: 1000
                    },
                    forecast: {
                        conditions: []
                    }
                }
            };

            service.getWeatherByIcaoCode(icaoCode).subscribe(response => {
                expect(response.ident).toBe(icaoCode);
            });

            const req = httpMock.expectOne(`/weather/report/${icaoCode}`);
            req.flush(mockResponse);
        });
    });
});
