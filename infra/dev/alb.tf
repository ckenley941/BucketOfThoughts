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

# URL Map - routes /api/* to API backend, everything else to web static bucket
resource "google_compute_url_map" "bucket_of_thoughts_alb" {
  name            = "bucket-of-thoughts-alb"
  default_service = google_compute_backend_bucket.web_backend.id

  host_rule {
    hosts        = ["*"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_bucket.web_backend.id

    path_rule {
      paths   = ["/api", "/api/*"]
      service = google_compute_backend_service.bucket_of_thoughts_api_backend_service.id
    }
  }
}

# HTTPS Proxy
resource "google_compute_target_https_proxy" "bucket_of_thoughts_https_proxy" {
  name             = "bucket-of-thoughts-https-proxy"
  url_map          = google_compute_url_map.bucket_of_thoughts_alb.id
  ssl_certificates = [google_compute_managed_ssl_certificate.bucket_of_thoughts_alb_cert.id]
}

# Global Forwarding Rule
resource "google_compute_global_forwarding_rule" "bucket_of_thoughts_https" {
  name                  = "bucket-of-thoughts-https"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.bucket_of_thoughts_https_proxy.id
  ip_address            = google_compute_global_address.bucket_of_thoughts_alb_address.id
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "bucket_of_thoughts_http_redirect" {
  name = "bucket-of-thoughts-http-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "bucket_of_thoughts_http_proxy" {
  name    = "bucket-of-thoughts-http-proxy"
  url_map = google_compute_url_map.bucket_of_thoughts_http_redirect.id
}

resource "google_compute_global_forwarding_rule" "bucket_of_thoughts_http" {
  name                  = "bucket-of-thoughts-http"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.bucket_of_thoughts_http_proxy.id
  ip_address            = google_compute_global_address.bucket_of_thoughts_alb_address.id
}
