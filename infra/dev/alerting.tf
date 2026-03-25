# Cloud Monitoring Alert Policies

# Notification Channels
resource "google_monitoring_notification_channel" "email_alert" {
  display_name = "DEV Email Notifications"
  type         = "email"
  project      = local.project
  labels = {
    email_address = "ckenley941@gmail.com"
  }
}

# Web App Uptime Alert
resource "google_monitoring_alert_policy" "web_app_uptime_alert" {
  enabled      = true
  display_name = "DEV Web App Uptime Alert"
  combiner     = "OR"
  severity     = "CRITICAL"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]
  conditions {
    display_name = "[DEV] Uptime ping"
    condition_threshold {
      filter          = format("metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.\"check_id\"=\"%s\" AND resource.type=\"uptime_url\"", google_monitoring_uptime_check_config.web_uptime_check.uptime_check_id)
      duration        = "60s"
      comparison      = "COMPARISON_LT"
      threshold_value = "1"
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] Web app is failing uptime checks.**

    **Actions:** Check Cloud Storage bucket for deployed files. Verify load balancer configuration. Check DNS settings for bucketofthoughts.dev.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View uptime checks"
      url          = "https://console.cloud.google.com/monitoring/uptime?project=${local.project}"
    }
  }
}

# API Uptime Alert
resource "google_monitoring_alert_policy" "api_app_uptime_alert" {
  enabled      = true
  display_name = "DEV API Uptime Alert"
  combiner     = "OR"
  severity     = "CRITICAL"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]
  conditions {
    display_name = "[DEV] Uptime ping"
    condition_threshold {
      filter          = format("metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.\"check_id\"=\"%s\" AND resource.type=\"uptime_url\"", google_monitoring_uptime_check_config.api_uptime_check.uptime_check_id)
      duration        = "60s"
      comparison      = "COMPARISON_LT"
      threshold_value = "1"
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] API is failing uptime checks.**

    **Actions:** Check Cloud Run for bucket-of-thoughts-api failed revisions. Verify Cloud SQL bucket-of-thoughts-db is running and accepting connections. Roll back if no deployment is in progress.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View uptime checks"
      url          = "https://console.cloud.google.com/monitoring/uptime?project=${local.project}"
    }
  }
}

# API Log Alert
resource "google_monitoring_alert_policy" "api_log_alert" {
  enabled      = true
  display_name = "DEV API Failure Detected"
  combiner     = "OR"
  severity     = "ERROR"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]
  conditions {
    display_name = "[DEV] API failure detected"
    condition_matched_log {
      filter = "resource.type=cloud_run_revision AND resource.labels.service_name=bucket-of-thoughts-api AND severity>=ERROR"
      label_extractors = {
        "exception" = "REGEXP_EXTRACT(jsonPayload.exception, \"(.*)\")"
        "message"   = "REGEXP_EXTRACT(jsonPayload.message, \"(.*)\")"
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
    notification_rate_limit {
      period = "300s"
    }
  }

  documentation {
    content   = <<-EOT
    **[DEV] API logged an ERROR or higher severity event.**

    **Message:** `$${log.extracted_label.message}`

    **Exception:** `$${log.extracted_label.exception}`
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View logs"
      url          = "https://console.cloud.google.com/logs/query;query=resource.type%3Dcloud_run_revision%20AND%20resource.labels.service_name%3Dbucket-of-thoughts-api%20AND%20severity%3E%3DERROR?project=${local.project}"
    }
  }
}

# API CPU Alert
resource "google_monitoring_alert_policy" "api_cpu_alert" {
  enabled      = true
  display_name = "DEV API CPU Usage"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  conditions {
    display_name = "[DEV] API CPU over 70% for 10 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"bucket-of-thoughts-api\" AND metric.type=\"run.googleapis.com/container/cpu/utilizations\""
      duration   = "600s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }

      threshold_value = 0.7
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] API CPU usage exceeded 70% for 10 consecutive minutes.**

    **Actions:** Check Cloud Run bucket-of-thoughts-api metrics for request rate and CPU. If traffic-driven, verify max_instances in Terraform. If CPU is high at normal traffic, look for a recent deployment that added expensive computation.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View metrics"
      url          = "https://console.cloud.google.com/run/detail/${local.region}/bucket-of-thoughts-api/metrics?project=${local.project}"
    }
  }
}

# API Memory Alert
resource "google_monitoring_alert_policy" "api_memory_alert" {
  enabled      = true
  display_name = "DEV API Memory Usage"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  conditions {
    display_name = "[DEV] API memory over 70% for 5 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"bucket-of-thoughts-api\" AND metric.type=\"run.googleapis.com/container/memory/utilizations\""
      duration   = "300s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }

      threshold_value = 0.7
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] API memory usage exceeded 70% for 5 consecutive minutes.**

    **Actions:** Check Cloud Run bucket-of-thoughts-api memory metrics. A gradual climb suggests a leak; a sudden spike suggests a burst allocation. At 100%, Cloud Run OOM-kills the container and the 5xx alert fires.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View metrics"
      url          = "https://console.cloud.google.com/run/detail/${local.region}/bucket-of-thoughts-api/metrics?project=${local.project}"
    }
  }
}

# API 5xx Error Rate Alert
resource "google_monitoring_alert_policy" "api_5xx_alert" {
  enabled      = true
  display_name = "DEV API 5xx Error Rate"
  combiner     = "OR"
  severity     = "ERROR"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  conditions {
    display_name = "[DEV] API returning > 5 HTTP 5xx responses in 5 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"bucket-of-thoughts-api\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\""
      duration   = "0s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_SUM"
        cross_series_reducer = "REDUCE_SUM"
        group_by_fields      = ["resource.labels.service_name"]
      }

      threshold_value = 5
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] API is returning elevated HTTP 5xx error responses.**

    **Actions:** Check Cloud Run logs for crash indicators (`ExitCode`, `OOMKilled`), compare with memory usage metrics, and check for recent deployments that may have introduced regressions.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View API metrics"
      url          = "https://console.cloud.google.com/run/detail/${local.region}/bucket-of-thoughts-api/metrics?project=${local.project}"
    }
  }
}

# API Latency Alert
resource "google_monitoring_alert_policy" "api_latency_alert" {
  enabled      = true
  display_name = "DEV API Latency P99"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  conditions {
    display_name = "[DEV] API P99 latency > 5s for 5 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"bucket-of-thoughts-api\" AND metric.type=\"run.googleapis.com/request_latencies\" AND metric.labels.response_code_class=\"2xx\""
      duration   = "300s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_PERCENTILE_99"
      }

      threshold_value = 5000
      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] API P99 request latency exceeded 5 seconds.**

    **Actions:** Correlate timing with Cloud SQL CPU and connection count metrics. Check Cloud SQL Insights for slow queries.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View API metrics"
      url          = "https://console.cloud.google.com/run/detail/${local.region}/bucket-of-thoughts-api/metrics?project=${local.project}"
    }
  }
}

# Cloud SQL CPU Alert
resource "google_monitoring_alert_policy" "cloudsql_cpu_alert" {
  enabled      = true
  display_name = "DEV Cloud SQL CPU Alert"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project

  conditions {
    display_name = "[DEV] SQL CPU over 70% for 2 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloudsql_database\" AND metric.type=\"cloudsql.googleapis.com/database/cpu/utilization\""
      duration   = "120s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_MEAN"
      }

      threshold_value = 0.7
      trigger {
        count = 1
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] Cloud SQL CPU usage exceeded 70% for 2 consecutive minutes.**

    **Actions:** Open Cloud SQL Insights for slow queries in the last 30 minutes. Check connection count -- each connection adds per-connection CPU overhead. A recent deployment may have introduced a missing index or a full-table scan.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View SQL metrics"
      url          = "https://console.cloud.google.com/sql/instances?project=${local.project}"
    }
  }
}

# Cloud SQL Memory Alert
resource "google_monitoring_alert_policy" "cloudsql_memory_alert" {
  enabled      = true
  display_name = "DEV Cloud SQL Memory Alert"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project

  conditions {
    display_name = "[DEV] SQL memory over 70% for 10 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloudsql_database\" AND metric.type=\"cloudsql.googleapis.com/database/memory/utilization\""
      duration   = "600s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_MEAN"
      }

      threshold_value = 0.7
      trigger {
        count = 1
      }
    }
  }
  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] Cloud SQL memory usage exceeded 70% for 10 consecutive minutes.**

    **Actions:** Check connection count first -- each PostgreSQL connection uses ~5-10MB. If memory climbs without a connection increase, check PostgreSQL work_mem settings and sort-heavy queries in Cloud SQL Insights.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View SQL metrics"
      url          = "https://console.cloud.google.com/sql/instances?project=${local.project}"
    }
  }
}

# Cloud SQL Disk Alert
resource "google_monitoring_alert_policy" "cloudsql_disk_alert" {
  enabled      = true
  display_name = "DEV Cloud SQL Disk Utilization"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project

  conditions {
    display_name = "[DEV] SQL disk over 80% for 5 minutes"
    condition_threshold {
      filter     = "resource.type=\"cloudsql_database\" AND metric.type=\"cloudsql.googleapis.com/database/disk/utilization\""
      duration   = "300s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }

      threshold_value = 0.8
      trigger {
        count = 1
      }
    }
  }

  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] Cloud SQL disk usage exceeded 80%.**

    **Actions:** Identify what data is growing (query `pg_database_size()`, check WAL retention, look for runaway jobs). Consider adjusting disk size in database.tf.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View SQL metrics"
      url          = "https://console.cloud.google.com/sql/instances?project=${local.project}"
    }
  }
}

# Cloud SQL Connections Alert
resource "google_monitoring_alert_policy" "cloudsql_connections_alert" {
  enabled      = true
  display_name = "DEV Cloud SQL Connection Count"
  combiner     = "OR"
  severity     = "WARNING"
  project      = local.project

  conditions {
    display_name = "[DEV] SQL active connections > 20"
    condition_threshold {
      filter     = "resource.type=\"cloudsql_database\" AND metric.type=\"cloudsql.googleapis.com/database/network/connections\""
      duration   = "300s"
      comparison = "COMPARISON_GT"

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }

      threshold_value = 20
      trigger {
        count = 1
      }
    }
  }

  notification_channels = [
    google_monitoring_notification_channel.email_alert.id
  ]

  alert_strategy {
    auto_close = "604800s"
  }

  documentation {
    content   = <<-EOT
    **[DEV] Cloud SQL active connections exceeded 20.**

    **Actions:** Check for long-running transactions in Cloud SQL Insights. Check Cloud Run instance count and API logs for slow or stuck requests.
    EOT
    mime_type = "text/markdown"

    links {
      display_name = "View SQL metrics"
      url          = "https://console.cloud.google.com/sql/instances?project=${local.project}"
    }
  }
}
