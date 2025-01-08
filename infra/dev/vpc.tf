resource "google_compute_network" "vpc_network" {
  name                    = "bucket-of-thoughts-app-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "app_subnet" {
  name          = "bucket-of-thoughts-app-subnet"
  ip_cidr_range = local.app_subnet_cidr
  region        = local.region
  network       = google_compute_network.vpc_network.id
}
