using BucketOfThoughts.Api.Extensions;
using BucketOfThoughts.Api.Objects;
using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace BucketOfThoughts.Api.Middleware
{
    public class UserSessionMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context, BucketOfThoughtsDbContext dbContext)
        {
            var user = context.User;

            if (user?.Identity?.IsAuthenticated == true)
            {
                var auth0Id = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

                if (string.IsNullOrEmpty(auth0Id))
                {
                    await context.Response.WriteErrorResponse(new ErrorResponse(HttpStatusCode.Unauthorized, "Missing Auth0 ID in token."));
                    return;
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
                            await context.Response.WriteErrorResponse(new ErrorResponse(HttpStatusCode.Unauthorized, "User not found for the supplied Auth0 ID."));
                            return;
                        }
                    }

                    var roles = user.Claims
                        .Where(c => c.Type == "permissions" || c.Type == "role" || c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToList();

                    var session = new CurrentUserSession
                    {
                        Auth0Id = auth0Id,
                        LoginProfileId = loginProfile.Id,
                        Email = user.FindFirst("email")?.Value,
                        Roles = roles
                    };
                    context.Items["CurrentUser"] = session;
                }
            }
            else
            {
                await context.Response.WriteErrorResponse(new ErrorResponse(HttpStatusCode.Unauthorized, "User not authorized."));
                return;
            }

            await next(context);
        }
    }
}
