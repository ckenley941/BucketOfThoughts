resource "google_compute_global_address" "bucket_of_thoughts_alb_address" {
  name = "bucket-of-thoughts-alb-address"
}

resource "google_compute_managed_ssl_certificate" "bucket_of_thoughts_alb_cert" {
  provider = google-beta
  project  = local.project

  name = "bucket-of-thoughts-alb-cert"
  managed {
    domains = ["bucketofthoughts.dev"]
  }
}

resource "google_compute_region_network_endpoint_group" "bucket_of_thoughts_api_neg" {
  provider              = google-beta
  project               = local.project
  name                  = "bucket-of-thoughts-api-neg"
  network_endpoint_type = "SERVERLESS"
  region                = google_compute_subnetwork.app_subnet.region
  cloud_run {
    service = google_cloud_run_v2_service.bucket_of_thoughts_api.name
  }
}

// cloud armor config would go here
resource "google_compute_backend_service" "bucket_of_thoughts_api_backend_service" {
  name = "bucket-of-thoughts-api-backend"

  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.bucket_of_thoughts_api_neg.id
  }
}
