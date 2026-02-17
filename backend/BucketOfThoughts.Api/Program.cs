using Auth0Net.DependencyInjection;
using BucketOfThoughts.Api.Middleware;
using BucketOfThoughts.Data;
using BucketOfThoughts.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Linq;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var uiAppUrl = builder.Configuration["UI_APP_URL"] ?? throw new ArgumentNullException("UI_APP_URL is missing");

var corsPolicyName = "UI-APP-ACCESS";
builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            name: corsPolicyName,
            policy =>
            {
                policy.WithOrigins(uiAppUrl)
                .AllowAnyHeader()
                .AllowAnyMethod();
            });
    }
);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<BucketOfThoughtsDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IThoughtService, ThoughtService>();
builder.Services.AddScoped<IThoughtBucketService, ThoughtBucketService>();
builder.Services.AddScoped<IThoughtDetailService, ThoughtDetailService>();
builder.Services.AddScoped<IThoughtWebsiteLinkService, ThoughtWebsiteLinkService>();
builder.Services.AddScoped<IUserSessionProvider, UserSessionProvider>();

var domain = builder.Configuration["AUTH0_DOMAIN"] ?? throw new ArgumentNullException("AUTH0_DOMAIN is missing");
var audience = builder.Configuration["AUTH0_AUDIENCE"] ?? throw new ArgumentNullException("AUTH0_AUDIENCE is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.Authority = $"https://{domain}/";
    options.Audience = audience;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.Email
    };
});


//builder.Services.AddAuth0AuthenticationClient(config =>
//{
//    config.Domain = domain;
//    config.ClientId = clientId;
//    config.ClientSecret = clientSecret;
//});

builder.Services.AddAuth0ManagementClient().AddAccessToken(config =>
{
    config.Audience = $"https://{domain}/api/v1/";
});

builder.Services.AddAuthorization();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bucket Of Thoughts API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Apply database migrations
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        try
        {
            var context = services.GetRequiredService<BucketOfThoughtsDbContext>();

            // Apply pending migrations (this will create the database if it doesn't exist)
            var pendingMigrations = context.Database.GetPendingMigrations().ToList();
            if (pendingMigrations.Any())
            {
                logger.LogInformation($"Applying {pendingMigrations.Count} pending migration(s): {string.Join(", ", pendingMigrations)}");
            }
            else
            {
                logger.LogInformation("No pending migrations.");
            }

            context.Database.Migrate();
            logger.LogInformation("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database. Error: {ErrorMessage}", ex.Message);
            // Re-throw in development to see the error
            if (app.Environment.IsDevelopment())
            {
                throw;
            }
        }
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseMiddleware<UserSessionMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();
