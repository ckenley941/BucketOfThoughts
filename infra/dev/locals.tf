locals {
  project                    = "bucket-of-thoughts-dev"
  env                        = "dev"
  region                     = "us-central1"
  container_registry_api     = "bucket-of-thoughts-api"
  container_registry_ui      = "bucket-of-thoughts-ui"

  app_cpu            = "1000m"
  app_mem            = "512Mi"
  ui_cpu             = "1000m"
  ui_mem             = "512Mi"
  con_cpu            = "1000m"
  con_mem            = "512Mi"
  max_instance_count = 2
  app_subnet_cidr    = "10.0.0.0/24"

  db_tier        = "db-perf-optimized-N-2"
  db_subnet_cidr = "10.0.10.0/24"

  db_authorized_ips = [
    {
      name = "Colin-Home"
      ip   = "64.110.14.50"
    }
  ]

  doc_storage_admins = [
    "user:ckenley941@gmail.com"
  ]
}