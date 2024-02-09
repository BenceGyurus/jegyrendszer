terraform {
  required_providers {
    kubernetes = {
        source = "hashicorp/kubernetes"
        version = ">=2.23.0"
    }
    helm = {
      source = "hashicorp/helm"
      version = "2.11.0"
    }   
  }
}

variable "client_certificate" {
    type = string
}
variable "client_key" {
    type = string
}
variable "cluster_ca_certificate" {
    type = string
}

provider "kubernetes" {
  host = "http://10.10.10.111:6443"

  client_certificate = base64decode(var.client_certificate)
  client_key = base64decode(var.client_key)
  cluster_ca_certificate = base64decode(var.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host = "http://10.10.10.111:6443"
    client_certificate = base64decode(var.client_certificate)
    client_key = base64decode(var.client_key)
    cluster_ca_certificate = base64decode(var.cluster_ca_certificate)

  }
}