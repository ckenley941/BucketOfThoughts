# Spinning up the App
## Backend
* Created backend folder
* Added .NET 8 API project
* Copied api.dockerfile from Syndicately and removed unneeded code

## Frontend
* From root folder
* `yarn create vite frontend --template react-ts`
* Copied ui.dockerfile from Syndicately and slightly refactored
* `docker build -f ui.Dockerfile . -t us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-ui/app:latest`
* `docker push us-central1-docker.pkg.dev/bucket-of-thoughts-dev/bucket-of-thoughts-ui/app:latest`

## GCR Setup
* Created account using gmail ($300 in free credit to start)
* Created project bucket-of-thoughts-dev
* Created bucket "bucket-of-thoughts-tf-state-dev" (matches terraform.tfstate for bucket)

## Terraform
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

## Git
* Go to root folder
* Create .gitignore file and make sure it ignores node_modules and .terraform files
* `git init`
* `git add`
* `git commit -m  "Initial commit"`
* `git remote add origin https://github.com/ckenley941/BucketOfThoughts.git`
* `git branch -M main`
* `git push -u origin main`
