export interface WeatherCacheConfig {
    /**
     * Default TTL for weather reports in milliseconds
     * Default: 5 minutes (300,000 ms)
     */
    defaultTTL: number;
    
    /**
     * Maximum number of cached entries
     * Default: 100
     */
    maxEntries: number;
    
    /**
     * Whether to enable automatic cleanup of expired entries
     * Default: true
     */
    enableAutoCleanup: boolean;
    
    /**
     * Interval for automatic cleanup in milliseconds
     * Default: 1 minute (60,000 ms)
     */
    cleanupInterval: number;
}

export const DEFAULT_WEATHER_CACHE_CONFIG: WeatherCacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100,
    enableAutoCleanup: true,
    cleanupInterval: 60 * 1000 // 1 minute
};
