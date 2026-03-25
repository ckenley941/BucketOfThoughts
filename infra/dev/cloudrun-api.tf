resource "google_cloud_run_v2_service" "bucket_of_thoughts_api" {
  name                = "bucket-of-thoughts-api"
  location            = "us-central1"
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [
      template[0].labels,
      template[0].containers[0].image,  # Managed by CI/CD
      client,
      client_version,
    ]
  }

  template {
    service_account = google_service_account.bucket_of_thoughts_app_svcacct.email

    scaling {
      max_instance_count = local.max_instance_count
    }

    containers {
      # Use placeholder image if real image doesn't exist yet
      # After first deploy, update with: us-central1-docker.pkg.dev/bucket-of-thoughts-dev-491315/${local.container_registry_api}/app:latest
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      name  = "app-1"
      resources {
        limits = {
          "cpu"    = local.app_cpu
          "memory" = local.app_mem
        }
      }
      ports {
        container_port = 8080
      }

      # Environment variables from Google Secret Manager
      env {
        name = "AUTH0_DOMAIN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.auth0_domain.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "AUTH0_AUDIENCE"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.auth0_audience.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "UI_APP_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.ui_app_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "DB_CONN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_connection.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "ASPNETCORE_ENVIRONMENT"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.aspnetcore_environment.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "ASPNETCORE_URLS"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.aspnetcore_urls.secret_id
            version = "latest"
          }
        }
      }
    }

    vpc_access {
      network_interfaces {
        network    = google_compute_network.vpc_network.name
        subnetwork = google_compute_subnetwork.app_subnet.name
      }
    }
  }

  depends_on = [
    google_secret_manager_secret_iam_member.api_secrets
  ]
}

resource "google_cloud_run_service_iam_binding" "cloudrun_all_access_api" {
  location = google_cloud_run_v2_service.bucket_of_thoughts_api.location
  service  = google_cloud_run_v2_service.bucket_of_thoughts_api.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}