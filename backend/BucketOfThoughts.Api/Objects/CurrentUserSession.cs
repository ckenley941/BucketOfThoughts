using System.Security.Claims;

namespace BucketOfThoughts.Api.Objects;

public class CurrentUserSession
{
    public string Auth0Id { get; set; } = null!;
    public long LoginProfileId { get; set; }
    public string? Email { get; set; }
    public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
}
