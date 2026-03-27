namespace BucketOfThoughts.Data;

/// <summary>
/// Npgsql maps CLR <see cref="DateTime"/> to <c>timestamp with time zone</c> and accepts only UTC <see cref="DateTime.Kind"/>.
/// System.Text.Json and many clients deserialize instants as <see cref="DateTimeKind.Unspecified"/>.
/// </summary>
public static class DateTimeUtcNormalization
{
    public static DateTime ToNpgsqlUtc(this DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc => value,
        DateTimeKind.Local => DateTime.SpecifyKind(value.ToUniversalTime(), DateTimeKind.Utc),
        _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
    };
}
