# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution and project files
COPY ./backend/BucketOfThoughts.sln ./
COPY ./backend/BucketOfThoughts.Api/BucketOfThoughts.Api.csproj ./BucketOfThoughts.Api/
COPY ./backend/BucketOfThoughts.Data/BucketOfThoughts.Data.csproj ./BucketOfThoughts.Data/
COPY ./backend/BucketOfThoughts.Services/BucketOfThoughts.Services.csproj ./BucketOfThoughts.Services/

# Restore dependencies
RUN dotnet restore "./BucketOfThoughts.Api/BucketOfThoughts.Api.csproj"

# Copy remaining source files
COPY ./backend/BucketOfThoughts.Api/ ./BucketOfThoughts.Api/
COPY ./backend/BucketOfThoughts.Data/ ./BucketOfThoughts.Data/
COPY ./backend/BucketOfThoughts.Services/ ./BucketOfThoughts.Services/

# Publish the application
RUN dotnet publish "./BucketOfThoughts.Api/BucketOfThoughts.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BucketOfThoughts.Api.dll"]