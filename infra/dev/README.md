# GCP Cloud Infrastructure

## Auth to GCP via gcloud

* [Install the gcloud CLI](https://cloud.google.com/sdk/docs/install)
* Open terminal in `infra/` directory
* `gcloud init`
* Select the bucket-of-thoughts-dev project
* `gcloud auth application-default login`

## First Time in Terraform

* `terraform init`
* `terraform plan`

## Stand up environment

* `terraform plan`
* `terraform apply`
    - Note: Google Cloud requires certain services to be explicitly enabled (`services.tf`). The first time you apply Terraform, some resources might fail to apply due to the new APIs taking a few minutes to register as enabled. Simply apply the Terraform again after waiting a few minutes.
* Get url from [console](https://console.cloud.google.com/run?authuser=1&project=bucket-of-thoughts-dev)

## Deploy a New Version

The image pull is based off the "latest" tag.

* Select app from [console](https://console.cloud.google.com/run/detail/us-central1/bucket-of-thoughts-server/metrics?authuser=1&project=bucket-of-thoughts-dev)
* Click edit and deploy new version
* Scroll to bottom (no change necessary) and click "Deploy"

## Tearing down environment

* `terraform destroy`
    - Note: the VPC private IP will fail to destroy due to being "in-use" unless you manually go to VPC -> VPC Network Peering and delete the `servicenetworking.googleapis.com` peering in Google Cloud Console.
    - TODO: Why does the equivalent gcloud CLI command fail to execute? `gcloud services vpc-peerings delete --service=servicenetworking.googleapis.com --network=bucket-of-thoughts-app-network --project=bucket-of-thoughts-dev`

## TODO

* Move all secrets to secret manager references (out from source via configuration in cloud run)
