resource "google_compute_global_address" "db_private_ip_address" {
  provider      = google
  name          = "db-private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  provider = google

  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.db_private_ip_address.name]
}

resource "google_sql_database_instance" "bucket_of_thoughts_instance" {
  provider = google

  name                = "bucket-of-thoughts-db"
  region              = local.region
  database_version    = "POSTGRES_16"
  deletion_protection = false

  depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = local.db_tier

    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.vpc_network.id

      dynamic "authorized_networks" {
        for_each = local.db_authorized_ips
        iterator = ip

        content {
          name  = ip.value.name
          value = ip.value.ip
        }
      }
    }

    maintenance_window {
      day  = 1
      hour = 1
    }
  }
}

resource "google_sql_database" "bucket_of_thoughts_db" {
  name     = "bucket-of-thoughts"
  instance = google_sql_database_instance.bucket_of_thoughts_instance.name
}

resource "google_sql_user" "sql_user" {
  instance = google_sql_database_instance.bucket_of_thoughts_instance.name
  name     = "app-user"
  password = random_password.database_password[0].result

  lifecycle {
    ignore_changes = [password]
  }
}
