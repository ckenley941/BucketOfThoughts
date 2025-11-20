using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BucketOfThoughts.Services.Extensions;

public static class DistributedCacheExtension
{
    public static async Task SetRecordAsync<T>(this IDistributedCache cache, string key, T data,
        TimeSpan? absoluteExpireTime = null, TimeSpan? unusedExpireTime = null)
    {
        var options = new DistributedCacheEntryOptions()
        {
            AbsoluteExpirationRelativeToNow = absoluteExpireTime ?? TimeSpan.FromSeconds(60),
            SlidingExpiration = unusedExpireTime
        };

        var jsonData = JsonSerializer.Serialize(data, new JsonSerializerOptions() { ReferenceHandler = ReferenceHandler.IgnoreCycles });
        await cache.SetStringAsync(key, jsonData, options);
    }

    public static async Task<T> GetRecordAsync<T>(this IDistributedCache cache, string key)
    {
        var jsonData = await cache.GetStringAsync(key);
        if (jsonData is null)
        {
            return default;
        }
        return JsonSerializer.Deserialize<T>(jsonData);
    }
}
