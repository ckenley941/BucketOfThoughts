resource "google_storage_bucket" "owner_docs" {
  name          = var.bucket_name
  location      = "US"
  force_destroy = true
  storage_class = "MULTI_REGIONAL"

  versioning {
    enabled = true
  }
  #force_destroy = true
}

data "google_iam_policy" "owner-doc-bucket-admin" {
  binding {
    role = "roles/storage.admin"
    members = var.admins
  }
}

resource "google_storage_bucket_iam_policy" "policy" {
  bucket      = google_storage_bucket.owner_docs.name
  policy_data = data.google_iam_policy.owner-doc-bucket-admin.policy_data
}
