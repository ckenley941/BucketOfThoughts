# Artifact Registry for Docker images

# API Docker Repository
resource "google_artifact_registry_repository" "bucket_of_thoughts_api" {
  project       = local.project
  location      = local.region
  repository_id = "bucket-of-thoughts-api"
  description   = "Docker repository for Bucket of Thoughts API"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}

# Output the repository URL
output "api_repository_url" {
  description = "Artifact Registry repository URL for API"
  value       = "${local.region}-docker.pkg.dev/${local.project}/${google_artifact_registry_repository.bucket_of_thoughts_api.repository_id}"
}
