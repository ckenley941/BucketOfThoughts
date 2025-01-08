resource "random_password" "database_password" {
  count            = 1
  length           = 24
  special          = true
  override_special = "_%@"
}