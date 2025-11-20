using BucketOfThoughts.Api.Objects;
using System.Net;
using System.Text.Json;

namespace BucketOfThoughts.Api.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        ErrorResponse? errorResponse = null;

        switch (exception)
        {
            
            default:
                errorResponse = new ErrorResponse(HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.");
                break;
        }

        await ResponseHandler.WriteErrorResponse(context, errorResponse);
    }
}
