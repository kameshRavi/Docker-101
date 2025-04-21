provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_artifact_registry_repository" "repo" {
  provider      = google
  location      = var.region
  repository_id = var.artifact_repo
  format        = "DOCKER"
}

resource "null_resource" "build_and_push_backend_image" {
  provisioner "local-exec" {
    command = <<EOT
      # Authenticate Docker with Google Artifact Registry
      gcloud auth configure-docker ${var.region}-docker.pkg.dev

      # Build the Docker image using your existing Dockerfile
      docker build \
      -f ../backend/Dockerfile \
      --platform linux/amd64 \
      -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.backend_service_and_image_name}:latest \
      ../backend/

      # Push the image to Google Artifact Registry
      docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.backend_service_and_image_name}:latest
    EOT
  }

  depends_on = [google_artifact_registry_repository.repo]
}

resource "null_resource" "build_and_push_frontend_image" {
  provisioner "local-exec" {
    command = <<EOT
      # Authenticate Docker with Google Artifact Registry
      gcloud auth configure-docker ${var.region}-docker.pkg.dev

      # Build the Docker image using your existing Dockerfile
      docker build \
      -f ../frontend/Dockerfile \
      --platform linux/amd64 \
      --build-arg VITE_API_URL=${google_cloud_run_v2_service.backend.uri} \
      -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.frontend_service_and_image_name}:latest \
      ../frontend/

      # Push the image to Google Artifact Registry
      docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.frontend_service_and_image_name}:latest
    EOT
  }

  depends_on = [google_artifact_registry_repository.repo, google_cloud_run_v2_service.backend]
}

resource "google_cloud_run_v2_service" "backend" {
  name                = var.backend_service_and_image_name
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.backend_service_and_image_name}:latest"
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    max_instance_request_concurrency = 100
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [null_resource.build_and_push_backend_image]
}

resource "google_cloud_run_v2_service" "frontend" {
  name                = var.frontend_service_and_image_name
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo}/${var.frontend_service_and_image_name}:latest"
      ports {
        container_port = 3000
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    max_instance_request_concurrency = 100
  }
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [null_resource.build_and_push_frontend_image]

}

resource "google_cloud_run_service_iam_member" "backend_public_access" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"

  depends_on = [google_cloud_run_v2_service.backend]
}

resource "google_cloud_run_service_iam_member" "frontend_public_access" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"

  depends_on = [google_cloud_run_v2_service.frontend]
}