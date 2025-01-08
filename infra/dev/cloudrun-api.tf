resource "google_cloud_run_v2_service" "bucket_of_thoughts_api" {
  name                = "bucket-of-thoughts-api"
  location            = "us-central1"
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [
      template[0].labels,
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
      image = "us-central1-docker.pkg.dev/bucket-of-thoughts-dev/${local.container_registry_api}/app:latest"
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
    }

    vpc_access {
      network_interfaces {
        network    = google_compute_network.vpc_network.name
        subnetwork = google_compute_subnetwork.app_subnet.name
      }
    }
  }
}

resource "google_cloud_run_service_iam_binding" "cloudrun_all_access_api" {
  location = google_cloud_run_v2_service.bucket_of_thoughts_api.location
  service  = google_cloud_run_v2_service.bucket_of_thoughts_api.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}