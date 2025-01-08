resource "google_service_account" "dev_service_account" {
  account_id   = "dev-service-account-id"
  display_name = "Service Account for Dev"
}

# rotating key
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account_key#example-usage-creating-and-regularly-rotating-a-key
resource "google_service_account_key" "dev_app_key" {
  service_account_id = google_service_account.dev_service_account.name
  # public_key_type    = "TYPE_X509_PEM_FILE"
}
