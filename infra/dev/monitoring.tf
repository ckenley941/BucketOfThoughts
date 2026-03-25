# Cloud Monitoring uptime checks

resource "google_monitoring_uptime_check_config" "web_uptime_check" {
  display_name = "web-uptime-check"
  timeout      = "10s"
  project      = local.project

  http_check {
    use_ssl        = true
    path           = "/"
    port           = "443"
    request_method = "GET"
    ping_config {
      pings_count = 1
    }
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
      status_value = 0
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = local.project
      host       = "bucketofthoughts.dev"
    }
  }
}

resource "google_monitoring_uptime_check_config" "api_uptime_check" {
  display_name = "api-uptime-check"
  timeout      = "10s"
  project      = local.project

  http_check {
    use_ssl        = true
    path           = "/api/health"
    port           = "443"
    request_method = "GET"
    ping_config {
      pings_count = 1
    }
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
      status_value = 0
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = local.project
      host       = "bucketofthoughts.dev"
    }
  }
}
