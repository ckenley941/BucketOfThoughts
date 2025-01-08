variable "bucket_name" {
  description = "Name of the s3 bucket. Must be unique."
  type        = string
}

variable "admins" {
  description = "User account that will manage the bucket."
  type        = list(string)
}
