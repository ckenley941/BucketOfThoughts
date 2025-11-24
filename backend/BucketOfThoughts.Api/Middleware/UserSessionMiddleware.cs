using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BucketOfThoughts.Api.Middleware
{
    public class UserSessionMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context, BucketOfThoughtsDbContext dbContext)
        {
            var user = context.User;
            var userSession = new CurrentUserSession() { Email = user.FindFirst("email")?.Value };
            if (user?.Identity?.IsAuthenticated == true)
            {
                userSession.IsAuthenticated = true;
                var auth0Id = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

                if (string.IsNullOrEmpty(auth0Id))
                {
                    userSession.Message = ApplicationServiceMessages.MissingAuth0IdToken;
                    await context.Response.WriteErrorResponse(new ErrorResponse(ServiceStatusCodes.Unauthorized, ApplicationServiceMessages.MissingAuth0IdToken));
                }
                else
                {
                    var loginProfile = await dbContext.LoginProfiles
                        .Where(lp => lp.Auth0Id == auth0Id)
                        .SingleOrDefaultAsync();

                    var autoSave = true;
                    if (loginProfile == null)
                    {
                        if (autoSave)
                        {
                            loginProfile = new LoginProfile
                            {
                                Auth0Id = auth0Id,
                                DisplayName = user.FindFirst("name")?.Value ?? "New User"
                            };
                            dbContext.LoginProfiles.Add(loginProfile);
                            await dbContext.SaveChangesAsync();
                        }
                        else
                        {
                            userSession.Message = ApplicationServiceMessages.UserNotFound;
                            await context.Response.WriteErrorResponse(new ErrorResponse(ServiceStatusCodes.Unauthorized, ApplicationServiceMessages.UserNotFound));
                        }
                    }

                    var roles = user.Claims
                        .Where(c => c.Type == "permissions" || c.Type == "role" || c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();

                    userSession.Auth0Id = auth0Id;
                    userSession.LoginProfileId = loginProfile?.Id ?? 0;
                    userSession.Roles = roles;

                }
                context.Items["CurrentUser"] = userSession;
            }
            else
            {
                userSession.IsAuthenticated = false;
                userSession.Message = ApplicationServiceMessages.UserNotAuthorized;
                await context.Response.WriteErrorResponse(new ErrorResponse(ServiceStatusCodes.Unauthorized, ApplicationServiceMessages.UserNotAuthorized));
                return;
            }

            await next(context);
        }
    }
}
