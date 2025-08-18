import {TestBed} from '@angular/core/testing';
import {WeatherNearbyService} from './weather-nearby.service';
import {provideZonelessChangeDetection} from '@angular/core';

describe('WeatherNearbyService', () => {
    let service: WeatherNearbyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()]
        });
        service = TestBed.inject(WeatherNearbyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return nearby weather for EKBI', () => {
        const nearby = service.getNearbyAirport('EKBI');
        expect(nearby).toBe('EKYT');
    });

    it('should return nearby weather for KMAI', () => {
        const nearby = service.getNearbyAirport('KMAI');
        expect(nearby).toBe('KMIA');
    });

    it('should return nearby weather for LEMD', () => {
        const nearby = service.getNearbyAirport('LEMD');
        expect(nearby).toBe('LEMG');
    });

    it('should return null for EDDM (no nearby weather)', () => {
        const nearby = service.getNearbyAirport('EDDM');
        expect(nearby).toBeUndefined();
    });

    it('should return null for unknown airport', () => {
        const nearby = service.getNearbyAirport('XXXX');
        expect(nearby).toBeUndefined();
    });

    it('should handle case-insensitive input', () => {
        const nearby = service.getNearbyAirport('ekbi');
        expect(nearby).toBe('EKYT');
    });

    it('should correctly identify airports with nearby alternatives', () => {
        expect(service.hasNearbyAirport('EKBI')).toBe(true);
        expect(service.hasNearbyAirport('KMAI')).toBe(true);
        expect(service.hasNearbyAirport('LEMD')).toBe(true);
        expect(service.hasNearbyAirport('EDDM')).toBe(false);
        expect(service.hasNearbyAirport('XXXX')).toBe(false);
    });
});
