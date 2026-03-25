# Storage bucket for React web app static website hosting
resource "google_storage_bucket" "web" {
  name     = "${local.project}-web"
  location = "US"
  project  = local.project

  uniform_bucket_level_access = true
  public_access_prevention    = "inherited"

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "web_public" {
  bucket = google_storage_bucket.web.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Backend bucket for load balancer
resource "google_compute_backend_bucket" "web_backend" {
  name        = "bucket-of-thoughts-web-backend"
  bucket_name = google_storage_bucket.web.name
  enable_cdn  = true
}
