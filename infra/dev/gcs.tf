module "gcs_module" {
  source      = "../modules/gcs"
  bucket_name = "bucket-of-thoughts-docs-${local.env}"
  admins = concat([
    //format("%s%s", "serviceAccount:", google_service_account.dev_service_account.email),
    format("%s%s", "serviceAccount:", google_service_account.bucket_of_thoughts_app_svcacct.email)
  ], local.doc_storage_admins)
}
