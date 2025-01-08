terraform {
  backend "gcs" {
    bucket = "bucket-of-thoughts-app-tf-state-dev"
    prefix = "terraform/state"
  }
}