resource "helm_release" "traefik" {
  name = "traefik"
  repository = "https://traefik.github.io/charts"
  chart = "traefik"
}

resource "helm_release" "jegyrendszer" {
  name = "jegyrendszer"
  chart = "../jegyrendszer"

  values = [ "${file("../jegyrendszer/values.yaml")}" ]
}