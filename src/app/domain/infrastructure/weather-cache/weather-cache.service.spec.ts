import {WeatherCacheService} from './weather-cache.service';
import {Metar, WeatherReport} from '../../models/weather.model';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('WeatherCacheService', () => {
    let service: WeatherCacheService;
    let mockWeatherReport: WeatherReport;

    beforeEach(() => {
        service = new WeatherCacheService();

        // Create mock weather report
        const mockMetar: Metar = {
            date: new Date(),
            text: 'Test METAR',
            wind: '10 kts',
            visibility: '10 SM',
            clouds: 'Clear',
            temperature: '20°C',
            dewpoint: '15°C',
            altimeter: '29.92',
            humidity: '70%',
            flightRules: 'VFR',
            densityAltitude: '1000 ft',
            expire: new Date()
        };

        mockWeatherReport = {
            ident: 'TEST',
            metar: mockMetar,
            taf: [mockMetar]
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store and retrieve weather report', () => {
        service.set('TEST', mockWeatherReport);
        const retrieved = service.get('TEST');

        expect(retrieved).toEqual(mockWeatherReport);
    });

    it('should return null for non-existent ICAO code', () => {
        const result = service.get('NONEXISTENT');
        expect(result).toBeNull();
    });

    it('should handle case-insensitive ICAO codes', () => {
        service.set('test', mockWeatherReport);
        const retrieved = service.get('TEST');

        expect(retrieved).toEqual(mockWeatherReport);
    });

    it('should check if cache has entry', () => {
        expect(service.has('TEST')).toBe(false);

        service.set('TEST', mockWeatherReport);
        expect(service.has('TEST')).toBe(true);
    });

    it('should delete specific entry', () => {
        service.set('TEST', mockWeatherReport);
        expect(service.has('TEST')).toBe(true);

        service.delete('TEST');
        expect(service.has('TEST')).toBe(false);
    });

    it('should clear all cache', () => {
        service.set('TEST1', mockWeatherReport);
        service.set('TEST2', mockWeatherReport);

        expect(service.getStats().size).toBe(2);

        service.clear();
        expect(service.getStats().size).toBe(0);
    });

    it('should provide cache statistics', () => {
        service.set('TEST1', mockWeatherReport);
        service.set('TEST2', mockWeatherReport);

        const stats = service.getStats();
        expect(stats.size).toBe(2);
        expect(stats.keys).toContain('TEST1');
        expect(stats.keys).toContain('TEST2');
    });

    it('should handle TTL expiration', () => {
        // Mock Date.now to control time
        const mockDate = new Date('2023-01-01T00:00:00Z');

        // Set initial time
        vi.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());

        // Set with very short TTL (1ms)
        service.set('TEST', mockWeatherReport, 1);

        // Advance time by 10ms
        vi.spyOn(Date, 'now').mockReturnValue(mockDate.getTime() + 10);

        const result = service.get('TEST');
        expect(result).toBeNull();

        // Restore original Date.now
        vi.restoreAllMocks();
    });

    it('should cleanup expired entries', () => {
        // Mock Date.now to control time
        const mockDate = new Date('2023-01-01T00:00:00Z');

        // Set initial time
        vi.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());

        // Set with very short TTL
        service.set('TEST1', mockWeatherReport, 1);
        service.set('TEST2', mockWeatherReport, 1000); // Longer TTL

        // Advance time by 10ms
        vi.spyOn(Date, 'now').mockReturnValue(mockDate.getTime() + 10);

        const removedCount = service.cleanup();
        expect(removedCount).toBe(1);
        expect(service.has('TEST1')).toBe(false);
        expect(service.has('TEST2')).toBe(true);

        // Restore original Date.now
        vi.restoreAllMocks();
    });

    it('should handle LRU eviction when max entries reached', () => {
        // Mock Date.now to control time
        const mockDate = new Date('2023-01-01T00:00:00Z');
        let currentTime = mockDate.getTime();

        vi.spyOn(Date, 'now').mockImplementation(() => {
            currentTime += 1; // Increment time for each call
            return currentTime;
        });

        // Set max entries to 2 for this test
        service.updateConfig({maxEntries: 2});

        // Add 3 entries with different timestamps
        service.set('TEST1', mockWeatherReport);
        service.set('TEST2', mockWeatherReport);
        service.set('TEST3', mockWeatherReport);

        // First entry should be evicted (LRU)
        expect(service.has('TEST1')).toBe(false);
        expect(service.has('TEST2')).toBe(true);
        expect(service.has('TEST3')).toBe(true);

        // Restore original Date.now
        vi.restoreAllMocks();
    });

    it('should update configuration', () => {
        const newConfig = {defaultTTL: 10 * 60 * 1000, maxEntries: 200};
        service.updateConfig(newConfig);

        const currentConfig = service.getConfig();
        expect(currentConfig.defaultTTL).toBe(10 * 60 * 1000);
        expect(currentConfig.maxEntries).toBe(200);
    });

    it('should get current configuration', () => {
        const config = service.getConfig();
        expect(config).toBeDefined();
        expect(config.defaultTTL).toBeDefined();
        expect(config.maxEntries).toBeDefined();
        expect(config.enableAutoCleanup).toBeDefined();
        expect(config.cleanupInterval).toBeDefined();
    });
});
