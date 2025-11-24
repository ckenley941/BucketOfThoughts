using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Objects;
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
                response.StatusCode = errorResponse.ErrorCode switch
                {
                    ServiceStatusCodes.UserForbidden => HttpStatusCode.Forbidden.GetIntValue(),
                    ServiceStatusCodes.Unauthorized => HttpStatusCode.Unauthorized.GetIntValue(),
                    _ => HttpStatusCode.InternalServerError.GetIntValue()
                };
                await response.WriteAsJsonAsync(errorResponse);
            }
        }
    }
}
