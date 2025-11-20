using Auth0Net.DependencyInjection;
using BucketOfThoughts.Data;
using BucketOfThoughts.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
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

builder.Services.AddDbContext<BucketOfThoughtsDbContext>(options =>
            options.UseInMemoryDatabase("YourInMemoryDbName"));

builder.Services.AddScoped<IThoughtService, ThoughtService>();

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
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
