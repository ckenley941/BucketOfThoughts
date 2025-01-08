using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var domain = builder.Configuration["AUTH0_DOMAIN"] ?? throw new ArgumentNullException("AUTH0_DOMAIN is missing");
var clientId = builder.Configuration["AUTH0_UI_CLIENTID"] ?? throw new ArgumentNullException("AUTH0_UI_CLIENTID is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = $"https://{domain}/";
    options.Audience = clientId;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.Email
    };
});

builder.Services.AddAuthorization();

var uiAppUrl = "http://localhost:5173";
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

// Configure the HTTP request pipeline.
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
