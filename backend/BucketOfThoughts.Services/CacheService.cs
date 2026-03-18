using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BucketOfThoughts.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? absoluteExpireTime = null);
    Task RemoveAsync(string key);
    Task<List<string>> GetUserRecentThoughtKeysAsync(long userId);
    Task AddUserRecentThoughtKeyAsync(long userId, string key);
    Task RemoveUserRecentThoughtKeyAsync(long userId, string key);
}

public class CacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    public CacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var jsonData = await _cache.GetStringAsync(key);
        if (string.IsNullOrEmpty(jsonData))
        {
            return default;
        }
        return JsonSerializer.Deserialize<T>(jsonData, JsonOptions);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? absoluteExpireTime = null)
    {
        var options = new DistributedCacheEntryOptions();
        if (absoluteExpireTime.HasValue)
        {
            options.AbsoluteExpirationRelativeToNow = absoluteExpireTime.Value;
        }
        else
        {
            // Default to 30 days for recent thoughts
            options.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30);
        }

        var jsonData = JsonSerializer.Serialize(value, JsonOptions);
        await _cache.SetStringAsync(key, jsonData, options);
    }

    public async Task RemoveAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }

    public async Task<List<string>> GetUserRecentThoughtKeysAsync(long userId)
    {
        var keysKey = $"RecentThoughts_Keys_{userId}";
        var keys = await GetAsync<List<string>>(keysKey);
        return keys ?? new List<string>();
    }

    public async Task AddUserRecentThoughtKeyAsync(long userId, string key)
    {
        var keysKey = $"RecentThoughts_Keys_{userId}";
        var keys = await GetUserRecentThoughtKeysAsync(userId);
        
        // Remove if already exists (to move to top)
        keys.Remove(key);
        // Add to beginning
        keys.Insert(0, key);
        
        // Keep only 10 keys
        if (keys.Count > 10)
        {
            // Remove the oldest key (last in list) and its cache entry
            var oldestKey = keys[10];
            await RemoveAsync(oldestKey);
            keys.RemoveAt(10);
        }
        
        await SetAsync(keysKey, keys);
    }

    public async Task RemoveUserRecentThoughtKeyAsync(long userId, string key)
    {
        var keysKey = $"RecentThoughts_Keys_{userId}";
        var keys = await GetUserRecentThoughtKeysAsync(userId);
        keys.Remove(key);
        await SetAsync(keysKey, keys);
    }
}
