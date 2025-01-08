resource "google_secret_manager_secret" "app_svc_account_secret" {
  secret_id = "app-serviceaccount-tf"

  labels = {
    label = "bucket-of-thoughts-app"
  }

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "app_svc_account_secret_version" {
  secret      = google_secret_manager_secret.app_svc_account_secret.id
  secret_data = google_service_account_key.dev_app_key.private_key
}

resource "google_secret_manager_secret" "app_db_user" {
  secret_id = "app-db-user-tf"

  labels = {
    label = "bucket-of-thoughts-app"
  }

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "app_db_user_secret_version" {
  secret      = google_secret_manager_secret.app_db_user.id
  secret_data = format("Username=app-user;Host=%s;Database=postgres;Password=%s", google_sql_database_instance.bucket_of_thoughts_instance.private_ip_address, random_password.database_password[0].result)
}
