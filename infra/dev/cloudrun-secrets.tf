# Auth0 Domain
resource "google_secret_manager_secret" "auth0_domain" {
  secret_id = "auth0-domain"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "auth0_domain" {
  secret      = google_secret_manager_secret.auth0_domain.id
  secret_data = "dev-1d3aiv64eevxng3r.us.auth0.com"
}

# Auth0 Audience
resource "google_secret_manager_secret" "auth0_audience" {
  secret_id = "auth0-audience"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "auth0_audience" {
  secret      = google_secret_manager_secret.auth0_audience.id
  secret_data = "https://api.bucketofthoughts.dev/"
}

# UI App URL
resource "google_secret_manager_secret" "ui_app_url" {
  secret_id = "ui-app-url"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "ui_app_url" {
  secret      = google_secret_manager_secret.ui_app_url.id
  secret_data = "https://bucketofthoughts.dev"
}

# Database Connection String
resource "google_secret_manager_secret" "db_connection" {
  secret_id = "db-conn"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_connection" {
  secret      = google_secret_manager_secret.db_connection.id
  secret_data = "Host=${google_sql_database_instance.bucket_of_thoughts_instance.private_ip_address};Port=5432;Database=${google_sql_database.bucket_of_thoughts_db.name};Username=${google_sql_user.sql_user.name};Password=${random_password.database_password[0].result};SSL Mode=Require;Trust Server Certificate=true"
}

# ASPNETCORE_ENVIRONMENT
resource "google_secret_manager_secret" "aspnetcore_environment" {
  secret_id = "aspnetcore-environment"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "aspnetcore_environment" {
  secret      = google_secret_manager_secret.aspnetcore_environment.id
  secret_data = "Production"
}

# ASPNETCORE_URLS
resource "google_secret_manager_secret" "aspnetcore_urls" {
  secret_id = "aspnetcore-urls"
  project   = local.project

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "aspnetcore_urls" {
  secret      = google_secret_manager_secret.aspnetcore_urls.id
  secret_data = "http://+:8080"
}

# Grant Cloud Run service account access to secrets
resource "google_secret_manager_secret_iam_member" "api_secrets" {
  for_each = toset([
    google_secret_manager_secret.auth0_domain.secret_id,
    google_secret_manager_secret.auth0_audience.secret_id,
    google_secret_manager_secret.ui_app_url.secret_id,
    google_secret_manager_secret.db_connection.secret_id,
    google_secret_manager_secret.aspnetcore_environment.secret_id,
    google_secret_manager_secret.aspnetcore_urls.secret_id
  ])

  secret_id = each.value
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.bucket_of_thoughts_app_svcacct.email}"

  depends_on = [
    google_secret_manager_secret.auth0_domain,
    google_secret_manager_secret.auth0_audience,
    google_secret_manager_secret.ui_app_url,
    google_secret_manager_secret.db_connection,
    google_secret_manager_secret.aspnetcore_environment,
    google_secret_manager_secret.aspnetcore_urls
  ]
}
