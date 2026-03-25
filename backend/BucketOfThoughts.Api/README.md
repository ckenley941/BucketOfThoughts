# BucketOfThoughts API

## Environment Configuration

This API uses environment variables for configuration instead of appsettings.json files.

### Development Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local` with your local configuration:
   - `AUTH0_DOMAIN`: Your Auth0 tenant domain
   - `AUTH0_AUDIENCE`: Your Auth0 API audience
   - `UI_APP_URL`: The URL of your frontend app (for CORS)
   - `DB_CONN`: Your local database connection string

3. The `.env.local` file is automatically loaded in Development mode and is excluded from git.

### Production Setup

In production (Cloud Run), environment variables are injected from Google Cloud Secret Manager.

The secrets are managed via Terraform in `infra/dev/cloudrun-secrets.tf`:
- `auth0-domain`
- `auth0-audience`
- `ui-app-url`
- `db-conn`
- `aspnetcore-environment`
- `aspnetcore-urls`

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH0_DOMAIN` | Auth0 tenant domain | `dev-xxx.us.auth0.com` |
| `AUTH0_AUDIENCE` | Auth0 API audience | `https://api.bucketofthoughts.dev/` |
| `UI_APP_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `DB_CONN` | PostgreSQL connection string | `Host=localhost;Port=5432;Database=...` |
| `ASPNETCORE_ENVIRONMENT` | ASP.NET environment | `Development` or `Production` |
| `ASPNETCORE_URLS` | URLs to bind to | `http://+:8080` |

### Running the API

```bash
dotnet run
```

The API will automatically:
1. Load environment variables from `.env.local` (in Development)
2. Validate all required variables are present
3. Apply database migrations (in Development)
4. Start on port 8080

## Architecture

- **Development**: Uses `.env.local` file for configuration
- **Production**: Uses Google Cloud Secret Manager via Terraform
- **CI/CD**: GitHub Actions builds and deploys to Cloud Run
