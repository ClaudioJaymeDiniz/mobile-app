import { api } from "@/src/services/api/api"
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
} from "../types/projectTypes"

export async function listProjects() {
  const response = await api.get<Project[]>("/projects/")
  return response.data
}

export async function listArchivedProjects() {
  const response = await api.get<Project[]>("/projects/archived")
  return response.data
}

export async function getProjectById(projectId: string) {
  const response = await api.get<Project>(`/projects/${projectId}`)
  return response.data
}

export async function createProject(data: ProjectCreateRequest) {
  const response = await api.post<Project>("/projects/", {
    name: data.name,
    description: data.description ?? null,
    logoUrl: data.logoUrl ?? null,
    themeColor: data.themeColor ?? "#3B82F6",
    isPublic: data.isPublic ?? false,
  })

  return response.data
}

export async function updateProject(
  projectId: string,
  data: ProjectUpdateRequest
) {
  const response = await api.patch<Project>(`/projects/${projectId}`, data)
  return response.data
}

export async function archiveProject(projectId: string) {
  const response = await api.delete<Project>(`/projects/${projectId}`)
  return response.data
}

export async function restoreProject(projectId: string) {
  const response = await api.post<Project>(`/projects/${projectId}/restore`)
  return response.data
}

export async function permanentDeleteProject(projectId: string) {
  const response = await api.delete(`/projects/${projectId}/permanent`)
  return response.data
}