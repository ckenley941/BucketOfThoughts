using BucketOfThoughts.Api.Objects;
using System.Net;

namespace BucketOfThoughts.Api.Extensions
{
    public static class HttpExtensions
    {
        extension(HttpContext context)
        {
            public CurrentUserSession GetCurrentUser()
            {
                return context.Items["CurrentUser"] as CurrentUserSession ?? throw new Exception("Current User could not found.");
            }
        }

        extension(HttpStatusCode statusCode)
        {
            public int GetIntValue()
            {
                return (int)statusCode;
            }
        }

        extension(HttpResponse response)
        {
            public async Task WriteErrorResponse(ErrorResponse errorResponse)
            {
                response.ContentType = "application/json";
                response.StatusCode = errorResponse.Status;
                await response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}
