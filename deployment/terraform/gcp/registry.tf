resource "google_artifact_registry_repository" "jegyrendszer" {
  location = "eu-west-3"
  repository_id = "jegyrendszer"
  description = "official image repository for Agora Jegyrendszer"
  format = "DOCKER" 
}