# Spinning up the App
## For Backend
* Created backend folder
* Added .NET 8 API project
* Copied api.dockerfile from Syndicately and removed unneeded code

## For GCR Setup
* Created account using gmail ($300 in free credit to start)
* Created project bucket-of-thoughts-dev
* Created bucket "bucket-of-thoughts-tf-state-dev" (matches terraform.tfstate for bucket)

## For Terraform
* Created infra folder
* Copied syndicately terraform, refactored syndicately to bucket of thoughts and removed unneeded resources
* `terraform plan`
* `terraform init`
* Most resources built

### Gotchas
* Had to push first docker image to container (copied api.Dockerfile from Syndicately)
* `docker build -f api.Dockerfile . -t us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-api/app:latest`
* `gcloud auth login`
* `docker push us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-api/app:latest`
* Same issue applied for UI image

* When using terraform to ensure logged into correct gcr account:
* `gcloud auth application-default login`
	
## For Frontend
* From root folder
* `yarn create vite frontend --template react`
* Copied ui.dockerfile from Syndicately and slightly refactored
* `docker build -f ui.Dockerfile . -t us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-ui/app:latest`
* `docker push us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-ui/app:latest`
	