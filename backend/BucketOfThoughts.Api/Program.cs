using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


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

builder.Services.AddAuthorization();

//UI_APP_URL
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
