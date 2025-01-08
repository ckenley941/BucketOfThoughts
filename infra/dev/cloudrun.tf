resource "google_service_account" "bucket_of_thoughts_app_svcacct" {
  account_id   = "bucket-of-thoughts-app-svcacct"
  display_name = "Bucket Of Thoughts App Service Account (Cloud Run)"
}

data "google_iam_policy" "read_bucket_of_thoughts_secret" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    members = [
      "serviceAccount:${google_service_account.bucket_of_thoughts_app_svcacct.email}",
    ]
  }
  depends_on = [google_service_account.bucket_of_thoughts_app_svcacct]
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  project     = google_secret_manager_secret.app_db_user.project
  secret_id   = google_secret_manager_secret.app_db_user.secret_id
  policy_data = data.google_iam_policy.read_bucket_of_thoughts_secret.policy_data
}

resource "google_vpc_access_connector" "bucket_of_thoughts_app_vpc_connection" {
  project = google_compute_subnetwork.app_subnet.project
  region  = google_compute_subnetwork.app_subnet.region
  name    = "bucket-of-thoughts-app-vpc"

  min_instances = 2
  max_instances = 3

  subnet {
    name = google_compute_subnetwork.app_subnet.name
  }
}

resource "google_compute_router" "bucket_of_thoughts_app_router" {
  name    = "bucket-of-thoughts-app-router"
  network = google_compute_network.vpc_network.name
  region  = google_compute_subnetwork.app_subnet.region
}

resource "google_compute_address" "bucket_of_thoughts_app_ip" {
  name   = "bucket-of-thoughts-app-ip"
  region = google_compute_subnetwork.app_subnet.region
}

resource "google_compute_router_nat" "bucket_of_thoughts_app_router_nat" {
  name   = "bucket-of-thoughts-app-router-nat"
  router = google_compute_router.bucket_of_thoughts_app_router.name
  region = google_compute_subnetwork.app_subnet.region

  nat_ip_allocate_option = "MANUAL_ONLY"
  nat_ips                = [google_compute_address.bucket_of_thoughts_app_ip.self_link]

  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  subnetwork {
    name                    = google_compute_subnetwork.app_subnet.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
}
