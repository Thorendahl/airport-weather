# Weather Cache Layer

This directory contains the weather cache implementation for the airport weather application.

## Overview

The cache layer provides in-memory caching for weather reports to reduce API calls and improve application performance.

## Components

### WeatherCacheService
The main cache service that handles storing and retrieving weather reports.

**Features:**
- TTL (Time To Live) based expiration
- LRU (Least Recently Used) eviction when max entries reached
- Automatic cleanup of expired entries
- Case-insensitive ICAO code handling
- Configurable cache settings

**Key Methods:**
- `get(icaoCode: string)` - Retrieve cached weather report
- `set(icaoCode: string, data: WeatherReport, ttl?: number)` - Store weather report
- `has(icaoCode: string)` - Check if valid cached data exists
- `delete(icaoCode: string)` - Remove specific entry
- `clear()` - Clear all cache
- `cleanup()` - Remove expired entries
- `getStats()` - Get cache statistics
- `updateConfig(config: Partial<WeatherCacheConfig>)` - Update cache configuration

### WeatherCacheConfig
Configuration interface for cache behavior.

**Default Settings:**
- Default TTL: 5 minutes
- Max entries: 100
- Auto cleanup: enabled
- Cleanup interval: 1 minute

### WeatherService Integration
The main weather service has been updated to automatically use the cache:

- **Automatic caching**: All weather requests are automatically cached
- **Cache-first strategy**: Checks cache before making HTTP requests
- **Force refresh**: `refreshWeatherByIcaoCode()` method bypasses cache
- **Cache management**: Methods to clear specific or all cache entries

## Usage Examples

### Basic Usage
```typescript
// The weather service automatically uses cache
const weather = await this.weatherService.getWeatherByIcaoCode('KJFK');

// Force refresh (bypass cache)
const freshWeather = await this.weatherService.refreshWeatherByIcaoCode('KJFK');
```

### Cache Management
```typescript
// Clear cache for specific airport
this.weatherService.clearCache('KJFK');

// Clear all cache
this.weatherService.clearAllCache();

// Get cache statistics
const stats = this.weatherService.getCacheStats();
```

### Custom TTL
```typescript
// Cache with custom TTL (10 minutes)
this.cacheService.set('KJFK', weatherData, 10 * 60 * 1000);
```

### Configuration Updates
```typescript
// Update cache configuration
this.cacheService.updateConfig({
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  maxEntries: 200
});
```

## Benefits

1. **Performance**: Reduces API calls for frequently requested airports
2. **User Experience**: Faster response times for cached data
3. **API Efficiency**: Reduces load on weather API services
4. **Offline Resilience**: Cached data available even with network issues
5. **Configurable**: Adjustable TTL and cache size based on needs

## Considerations

- **Memory Usage**: Cache stores data in memory (configurable max entries)
- **Data Freshness**: Cached data may be slightly outdated (configurable TTL)
- **Cache Invalidation**: Manual cache clearing available when needed
- **Automatic Cleanup**: Expired entries are automatically removed

## Testing

The cache service includes comprehensive unit tests covering:
- Basic cache operations
- TTL expiration
- LRU eviction
- Configuration updates
- Auto cleanup functionality
