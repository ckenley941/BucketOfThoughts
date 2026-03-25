locals {
  project                = "bucket-of-thoughts-dev-491315"
  env                    = "dev"
  region                 = "us-central1"
  container_registry_api = "bucket-of-thoughts-api"

  app_cpu                = "1000m"
  app_mem                = "512Mi"
  con_cpu                = "1000m"
  con_mem                = "512Mi"
  max_instance_count     = 2
  app_subnet_cidr        = "10.0.0.0/24"
  vpc_connector_cidr     = "10.0.1.0/28"  # /28 required for VPC connector

  db_tier        = "db-perf-optimized-N-2"
  db_subnet_cidr = "10.0.10.0/24"

  db_authorized_ips = [
    {
      name = "Colin-Home"
      ip   = "73.153.99.230"
    }
  ]

  doc_storage_admins = [
    "user:ckenley941@gmail.com"
  ]
}