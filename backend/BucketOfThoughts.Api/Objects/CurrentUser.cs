using System.Security.Claims;

namespace BucketOfThoughts.Api.Objects;

public class CurrentUser
{
    public CurrentUser(ClaimsPrincipal claims)
    {
        Auth0Id = claims.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        Name = claims.FindFirstValue("Name") ?? string.Empty;
        Email = claims.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        ProfilePictureUrl = claims.FindFirstValue("picture") ?? string.Empty;
        EmailVerified = (claims.FindFirstValue("email_verified") ?? "false") == "true";
        FirstName = claims.FindFirst(ClaimTypes.GivenName)?.Value;
        LastName = claims.FindFirst(ClaimTypes.Surname)?.Value;
    }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Auth0Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool? EmailVerified { get; set; }
}

public static class SecurityExtensions
{
    public static string? FindFirstValue(this ClaimsPrincipal claims, string claimType)
    {
        var claim = claims.FindFirst(claimType);
        return claim?.Value;
    }

    public static string Auth0Id(this ClaimsPrincipal claims)
    {
        return claims.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
    }

    public static string Email(this ClaimsPrincipal claims)
    {
        return claims.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }
}
