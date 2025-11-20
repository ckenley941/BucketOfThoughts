using BucketOfThoughts.Api.Objects;

namespace BucketOfThoughts.Api.Extensions
{
    public static class HttpContextExtensions
    {
        public static CurrentUserSession GetCurrentUser(this HttpContext context)
        {
            return context.Items["CurrentUser"] as CurrentUserSession ?? throw new Exception("Current User could not found.");
        }
    }
}
