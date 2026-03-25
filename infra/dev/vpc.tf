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

# Dedicated /28 subnet for VPC Connector (required by Google Cloud)
resource "google_compute_subnetwork" "vpc_connector_subnet" {
  name          = "bucket-thoughts-vpc-conn"
  ip_cidr_range = local.vpc_connector_cidr
  region        = local.region
  network       = google_compute_network.vpc_network.id
}
