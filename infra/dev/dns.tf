resource "google_dns_record_set" "bucket_of_thoughts_dev_record_set" {
  name    = google_dns_managed_zone.bucket_of_thoughts_dev_zone.dns_name
  type    = "A"
  ttl     = 300
  project = local.project

  managed_zone = google_dns_managed_zone.bucket_of_thoughts_dev_zone.name

  rrdatas = [google_compute_global_address.bucket_of_thoughts_alb_address.address]
}

resource "google_dns_managed_zone" "bucket_of_thoughts_dev_zone" {
  project  = local.project
  name     = "bucket-of-thoughts-dev-zone"
  dns_name = "bucketofthoughts.dev."
  dnssec_config {
    state = "off"
  }
}

resource "google_dns_record_set" "bucket_of_thoughts_auth_dev_record_set" {
  name    = "login.${google_dns_managed_zone.bucket_of_thoughts_dev_zone.dns_name}"
  type    = "CNAME"
  ttl     = 300
  project = local.project

  managed_zone = google_dns_managed_zone.bucket_of_thoughts_dev_zone.name

  rrdatas = ["dev-6urqjiryuz5p2l4k-cd-aioyeimvmubpkxzf.edge.tenants.us.auth0.com."]
}
