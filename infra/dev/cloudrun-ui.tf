resource "google_cloud_run_v2_service" "bucket_of_thoughts_ui" {
  name                = "bucket-of-thoughts-ui"
  location            = "us-central1"
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.bucket_of_thoughts_app_svcacct.email
    containers {
      ports {
        container_port = 80
      }
      image = "us-central1-docker.pkg.dev/bucket-of-thoughts-dev/${local.container_registry_ui}/app:latest"
      resources {
        limits = {
          "cpu"    = local.ui_cpu
          "memory" = local.ui_mem
        }
      }
    }

    vpc_access{
      network_interfaces {
        network = google_compute_network.vpc_network.name
        subnetwork = google_compute_subnetwork.app_subnet.name
      }
    }
  }
}

resource "google_cloud_run_service_iam_binding" "cloudrun_all_access_ui" {
  location = google_cloud_run_v2_service.bucket_of_thoughts_ui.location
  service  = google_cloud_run_v2_service.bucket_of_thoughts_ui.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}