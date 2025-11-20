using BucketOfThoughts.Api.Objects;

namespace BucketOfThoughts.Api.Middleware
{
    public static class ResponseHandler
    {
        public static async Task WriteErrorResponse(HttpContext context, ErrorResponse errorResponse)
        {
            //TOODO: Log the error message
            context.Response.StatusCode = errorResponse.Status;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(errorResponse);
        }
    }
}
