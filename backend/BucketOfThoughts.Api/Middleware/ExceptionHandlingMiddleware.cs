using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Objects;
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
        ErrorResponse? errorResponse = exception switch
        {
            UserForbiddenCustomException => new ErrorResponse(HttpStatusCode.Forbidden, exception.Message),
            _ => new ErrorResponse(HttpStatusCode.InternalServerError, ApplicationServiceMessage.UnexpectedError),
        };
        await context.Response.WriteErrorResponse(errorResponse);
    }
}
