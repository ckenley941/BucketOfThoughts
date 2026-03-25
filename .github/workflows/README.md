# GitHub Actions Workflows

## Overview

This repository uses GitHub Actions to automatically build and deploy the application to Google Cloud Platform.

## Workflows

### 1. Build (PR Verification)
**File:** `build.yaml`

**Triggers:**
- Push to any branch except `main`
- Pull requests to `main`

**What it does:**
- Builds the API Docker image to verify it compiles
- Builds the frontend React app to verify it compiles
- Runs linting on frontend code
- Does NOT deploy anything

**Purpose:** Catch build errors before merging to main

---

### 2. Build-Push-API (API Deployment)
**File:** `build-push-api.yaml`

**Triggers:**
- Push to `main` branch when changes are made to:
  - `backend/**` (any backend code)
  - `api.Dockerfile`
- Manual trigger via workflow_dispatch

**What it does:**
1. ✅ Authenticates to GCP using Workload Identity Federation
2. ✅ Builds Docker image for .NET API
3. ✅ Pushes image to Google Artifact Registry
4. ✅ Deploys to Cloud Run service: `bucket-of-thoughts-api`
5. ✅ Shows deployed service URL

**Environment Variables from GCP Secrets:**
- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`
- `UI_APP_URL`
- `DB_CONN` (PostgreSQL)
- `ASPNETCORE_ENVIRONMENT`
- `ASPNETCORE_URLS`

**Deployment Target:**
- Service: `bucket-of-thoughts-api`
- Region: `us-central1`
- VPC: Connected via `bucket-thoughts-app-vpc`

---

### 3. Build-Push-Web (Frontend Deployment)
**File:** `build-push-web.yaml`

**Triggers:**
- Push to `main` branch when changes are made to:
  - `frontend/**` (any frontend code)
  - `infra/generate-react-env.sh`
- Manual trigger via workflow_dispatch

**What it does:**
1. ✅ Authenticates to GCP using Workload Identity Federation
2. ✅ Generates `.env` file from Google Secret Manager
3. ✅ Installs dependencies with npm
4. ✅ Builds Vite React app
5. ✅ Syncs build output to Google Cloud Storage bucket
6. ✅ Sets optimal cache headers:
   - Static assets (JS/CSS/images): `max-age=31536000` (1 year)
   - HTML files: `max-age=0, must-revalidate`

**Secrets from GCP Secret Manager:**
- `auth0-domain`
- `auth0-client-id`
- `auth0-audience`

**Deployment Target:**
- Bucket: `bucket-of-thoughts-dev-491315-web`
- Build output: `frontend/dist` (Vite output)

---

### 4. Build-Push-Development (DEPRECATED)
**File:** `build-push-dev.yaml`

**Status:** ⚠️ DEPRECATED - Use `build-push-api.yaml` and `build-push-web.yaml` instead

This workflow is kept for reference but will not trigger automatically.

---

## Authentication

All workflows use **Workload Identity Federation** for secure, keyless authentication to Google Cloud:

- **Workload Identity Provider:** `projects/532956049186/locations/global/workloadIdentityPools/github/providers/github-oidc`
- **Service Account:** `github-actions-default@bucket-of-thoughts-dev.iam.gserviceaccount.com`

This eliminates the need for storing GCP service account keys in GitHub.

## Required Secrets (GitHub Repository Secrets)

None! All secrets are managed in Google Cloud Secret Manager and accessed via Workload Identity Federation.

## Manual Deployment

To manually trigger a deployment:

1. Go to the **Actions** tab in GitHub
2. Select the workflow you want to run:
   - **Build-Push-API** - Deploy API
   - **Build-Push-Web** - Deploy Frontend
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Local Testing

Before pushing, you can test the builds locally:

### API
```bash
docker build -f api.Dockerfile -t bucket-of-thoughts-api:test .
```

### Frontend
```bash
cd frontend
npm install
npm run build
```

## Deployment Flow

```
Developer pushes to main
         ↓
GitHub Actions triggered (based on changed paths)
         ↓
┌────────────────┬────────────────┐
│   API Changes  │  Web Changes   │
├────────────────┼────────────────┤
│ Build Docker   │ Generate .env  │
│ Push to GCR    │ Build Vite app │
│ Deploy to CR   │ Sync to GCS    │
└────────────────┴────────────────┘
         ↓
   Deployment Complete
   Users see changes
```

## Troubleshooting

### API deployment fails
- Check Cloud Run logs: `gcloud run services logs tail bucket-of-thoughts-api --region=us-central1`
- Verify Docker image built: Check Artifact Registry
- Check VPC connector status
- Verify secrets exist in Secret Manager

### Frontend deployment fails
- Verify bucket exists: `gsutil ls gs://bucket-of-thoughts-dev-491315-web`
- Check if secrets exist in Secret Manager
- Verify build succeeds locally first

### Authentication fails
- Verify Workload Identity Federation is set up correctly
- Check service account has necessary permissions
- Ensure GitHub repository is added to Workload Identity Pool

## Permissions Required

The GitHub Actions service account needs:
- `roles/run.developer` - Deploy to Cloud Run
- `roles/artifactregistry.writer` - Push Docker images
- `roles/storage.objectAdmin` - Upload to Cloud Storage
- `roles/secretmanager.secretAccessor` - Read secrets

## Cost Optimization

- ✅ Workflows only run when relevant files change (path filters)
- ✅ Node.js dependencies are cached between runs
- ✅ Cloud Run scales to zero when not in use
- ✅ Static assets served from Cloud Storage (cheaper than Cloud Run)
