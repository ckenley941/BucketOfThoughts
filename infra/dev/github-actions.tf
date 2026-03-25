# GitHub Actions Workload Identity Federation Setup

# Enable IAM API
resource "google_project_service" "iam_api" {
  project            = local.project
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iamcredentials_api" {
  project            = local.project
  service            = "iamcredentials.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sts_api" {
  project            = local.project
  service            = "sts.googleapis.com"
  disable_on_destroy = false
}

# Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  project                   = local.project
  workload_identity_pool_id = "github"
  display_name              = "GitHub Actions Pool"
  description               = "Workload Identity Pool for GitHub Actions"

  depends_on = [
    google_project_service.iam_api,
    google_project_service.iamcredentials_api,
    google_project_service.sts_api
  ]
}

# Workload Identity Provider (GitHub OIDC)
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  project                            = local.project
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"
  display_name                       = "GitHub OIDC Provider"
  description                        = "OIDC provider for GitHub Actions"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
  }

  attribute_condition = "assertion.repository_owner == 'ckenley941'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  depends_on = [google_iam_workload_identity_pool.github_pool]
}

# Service Account for GitHub Actions
resource "google_service_account" "github_actions" {
  project      = local.project
  account_id   = "github-actions-default"
  display_name = "GitHub Actions Service Account"
  description  = "Service account used by GitHub Actions for CI/CD"
}

# Allow GitHub Actions to impersonate the service account
resource "google_service_account_iam_member" "github_actions_workload_identity" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/ckenley941/BucketOfThoughts"

  depends_on = [
    google_iam_workload_identity_pool_provider.github_provider
  ]
}

# Grant permissions to GitHub Actions service account

# Cloud Run Admin - Deploy services
resource "google_project_iam_member" "github_actions_cloudrun_admin" {
  project = local.project
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Artifact Registry Writer - Push Docker images
resource "google_project_iam_member" "github_actions_artifact_registry_writer" {
  project = local.project
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Storage Admin - Upload to GCS buckets
resource "google_project_iam_member" "github_actions_storage_admin" {
  project = local.project
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Secret Manager Accessor - Read secrets for env files
resource "google_project_iam_member" "github_actions_secret_accessor" {
  project = local.project
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Service Account User - Required to deploy Cloud Run services
resource "google_project_iam_member" "github_actions_sa_user" {
  project = local.project
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Outputs for GitHub Actions workflows
output "github_actions_workload_identity_provider" {
  description = "Workload Identity Provider ID for GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "github_actions_service_account_email" {
  description = "Service Account email for GitHub Actions"
  value       = google_service_account.github_actions.email
}

output "github_project_id" {
  description = "GCP Project ID (needed for workflows)"
  value       = local.project
}
