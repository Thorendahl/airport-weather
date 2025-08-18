import {Injectable} from '@angular/core';
import {WeatherReport} from '../../models/weather.model';
import {DEFAULT_WEATHER_CACHE_CONFIG, WeatherCacheConfig} from './weather-cache.config';

interface CacheEntry {
    data: WeatherReport;
    timestamp: number;
    ttl: number;
    lastAccessed: number;
}

@Injectable({
    providedIn: 'root'
})
export class WeatherCacheService {
    private readonly cache = new Map<string, CacheEntry>();
    private readonly config: WeatherCacheConfig;
    private cleanupInterval?: number;

    constructor() {
        this.config = {...DEFAULT_WEATHER_CACHE_CONFIG};
        this.startAutoCleanup();
    }

    /**
     * Get cached weather report for an ICAO code
     * @param icaoCode The ICAO airport code
     * @returns The cached weather report or null if not found/expired
     */
    get(icaoCode: string): WeatherReport | null {
        const key = icaoCode.toUpperCase();
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if entry has expired
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return null;
        }

        // Update last accessed time for LRU
        entry.lastAccessed = Date.now();
        return entry.data;
    }

    /**
     * Store weather report in cache
     * @param icaoCode The ICAO airport code
     * @param data The weather report data
     * @param ttl Optional TTL in milliseconds (defaults to configured default)
     */
    set(icaoCode: string, data: WeatherReport, ttl?: number): void {
        const key = icaoCode.toUpperCase();
        const now = Date.now();

        // Check if we need to evict entries due to max size
        if (this.cache.size >= this.config.maxEntries && !this.cache.has(key)) {
            this.evictLRU();
        }

        const entry: CacheEntry = {
            data,
            timestamp: now,
            ttl: ttl || this.config.defaultTTL,
            lastAccessed: now
        };

        this.cache.set(key, entry);
    }

    /**
     * Check if a weather report exists in cache and is not expired
     * @param icaoCode The ICAO airport code
     * @returns True if valid cached data exists
     */
    has(icaoCode: string): boolean {
        const key = icaoCode.toUpperCase();
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return false;
        }

        // Update last accessed time for LRU
        entry.lastAccessed = Date.now();
        return true;
    }

    /**
     * Remove a specific entry from cache
     * @param icaoCode The ICAO airport code
     */
    delete(icaoCode: string): void {
        const key = icaoCode.toUpperCase();
        this.cache.delete(key);
    }

    /**
     * Clear all cached data
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns Object with cache size and memory usage info
     */
    getStats(): { size: number; keys: string[]; config: WeatherCacheConfig } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            config: this.config
        };
    }

    /**
     * Clean up expired entries
     * @returns Number of expired entries removed
     */
    cleanup(): number {
        let removedCount = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
                removedCount++;
            }
        }

        return removedCount;
    }

    /**
     * Update cache configuration
     * @param newConfig Partial configuration to update
     */
    updateConfig(newConfig: Partial<WeatherCacheConfig>): void {
        Object.assign(this.config, newConfig);

        // Restart auto cleanup if interval changed
        if (newConfig.cleanupInterval !== undefined) {
            this.stopAutoCleanup();
            this.startAutoCleanup();
        }
    }

    /**
     * Get current configuration
     */
    getConfig(): WeatherCacheConfig {
        return {...this.config};
    }

    ngOnDestroy(): void {
        this.stopAutoCleanup();
    }

    private isExpired(entry: CacheEntry): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    private evictLRU(): void {
        if (this.cache.size === 0) return;

        let oldestKey = '';
        let oldestTime = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    private startAutoCleanup(): void {
        if (!this.config.enableAutoCleanup) return;

        this.cleanupInterval = window.setInterval(() => {
            this.cleanup();
        }, this.config.cleanupInterval);
    }

    private stopAutoCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = undefined;
        }
    }
}
