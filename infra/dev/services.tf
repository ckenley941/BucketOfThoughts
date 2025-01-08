resource "google_project_service" "vpcaccess" {
  project            = local.project
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secretmanager" {
  project            = local.project
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "servicenetworking" {
  project            = local.project
  service            = "servicenetworking.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "run_api" {
  project            = local.project
  service            = "run.googleapis.com"
  disable_on_destroy = false
}


resource "google_project_service" "scheduler" {
  project = local.project
  service = "cloudscheduler.googleapis.com"
}