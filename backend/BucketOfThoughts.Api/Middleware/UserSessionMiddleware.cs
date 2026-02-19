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
            //TODO - look into this
            // Skip OPTIONS requests (CORS preflight)
            if (context.Request.Method == "OPTIONS")
            {
                await next(context);
                return;
            }

            // Check if user session is already set to avoid redundant processing
            if (context.Items.ContainsKey("CurrentUser"))
            {
                await next(context);
                return;
            }

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
                    return;
                }

                var loginProfile = await dbContext.LoginProfiles
                    .Where(lp => lp.Auth0Id == auth0Id)
                    .SingleOrDefaultAsync();

                var autoSave = true;
                if (loginProfile == null)
                {
                    if (autoSave)
                    {
                        try
                        {
                            loginProfile = new LoginProfile
                            {
                                Auth0Id = auth0Id,
                                DisplayName = user.FindFirst("name")?.Value ?? "New User"
                            };
                            dbContext.LoginProfiles.Add(loginProfile);
                            await dbContext.SaveChangesAsync();
                        }
                        catch (DbUpdateException ex)
                        {
                            // Handle race condition: if another request created the profile concurrently,
                            // retry fetching it
                            if (ex.InnerException?.Message?.Contains("duplicate key") == true ||
                                ex.InnerException?.Message?.Contains("UNIQUE constraint") == true ||
                                ex.InnerException?.Message?.Contains("Cannot insert duplicate key") == true)
                            {
                                // Retry fetching the profile that was just created by another request
                                loginProfile = await dbContext.LoginProfiles
                                    .Where(lp => lp.Auth0Id == auth0Id)
                                    .SingleOrDefaultAsync();
                                
                                if (loginProfile == null)
                                {
                                    userSession.Message = ApplicationServiceMessages.UserNotFound;
                                    await context.Response.WriteErrorResponse(new ErrorResponse(ServiceStatusCodes.Unauthorized, ApplicationServiceMessages.UserNotFound));
                                    return;
                                }
                            }
                            else
                            {
                                throw;
                            }
                        }
                    }
                    else
                    {
                        userSession.Message = ApplicationServiceMessages.UserNotFound;
                        await context.Response.WriteErrorResponse(new ErrorResponse(ServiceStatusCodes.Unauthorized, ApplicationServiceMessages.UserNotFound));
                        return;
                    }
                }

                var roles = user.Claims
                    .Where(c => c.Type == "permissions" || c.Type == "role" || c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList();

                userSession.Auth0Id = auth0Id;
                userSession.LoginProfileId = loginProfile?.Id ?? 0;
                userSession.Roles = roles;

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
