resource "google_artifact_registry_repository" "api-repo" {
  location               = local.region
  repository_id          = "bucket-of-thoughts-api"
  description            = "Bucket Of Thoughts API"
  format                 = "DOCKER"
  cleanup_policy_dry_run = true
  docker_config {
    immutable_tags = false
  }

  cleanup_policies {
    id     = "cleanup-policy-api-repo"
    action = "KEEP"
    most_recent_versions {
      keep_count = 30
    }
  }
}

resource "google_artifact_registry_repository_iam_binding" "binding" {
  project    = google_artifact_registry_repository.api-repo.project
  location   = google_artifact_registry_repository.api-repo.location
  repository = google_artifact_registry_repository.api-repo.name
  role       = "roles/artifactregistry.reader"
  members = [
    "serviceAccount:${google_service_account.bucket_of_thoughts_app_svcacct.email}",
  ]
}

resource "google_artifact_registry_repository" "ui-repo" {
  location               = local.region
  repository_id          = "bucket-of-thoughts-ui"
  description            = "Bucket Of Thoughts UI"
  format                 = "DOCKER"
  cleanup_policy_dry_run = true
  docker_config {
    immutable_tags = false
  }

  cleanup_policies {
    id     = "cleanup-policy-ui-repo"
    action = "KEEP"
    most_recent_versions {
      keep_count = 30
    }
  }
}

resource "google_artifact_registry_repository_iam_binding" "ui-binding" {
  project    = google_artifact_registry_repository.ui-repo.project
  location   = google_artifact_registry_repository.ui-repo.location
  repository = google_artifact_registry_repository.ui-repo.name
  role       = "roles/artifactregistry.reader"
  members = [
    "serviceAccount:${google_service_account.bucket_of_thoughts_app_svcacct.email}",
  ]
}
