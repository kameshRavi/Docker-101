variable "project_id" {
  description = "The ID of the project in which the resources will be created."
  type        = string
}
variable "region" {
  description = "The region in which the resources will be created."
  type        = string
}
variable "artifact_repo" {
  description = "The name of the repository."
  type        = string
}

variable "backend_service_and_image_name" {
  description = "The name of the backend service and image."
  type        = string
}

variable "frontend_service_and_image_name" {
  description = "The name of the frontend service and image."
  type        = string
}