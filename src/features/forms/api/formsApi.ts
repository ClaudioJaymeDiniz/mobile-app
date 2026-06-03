import { api } from "@/src/services/api/api"
import type {
  Form,
  FormCreateRequest,
  FormUpdateRequest,
  PublicForm,
} from "../types/formTypes"

export async function listProjectForms(projectId: string) {
  const response = await api.get<Form[]>(`/forms/project/${projectId}`)
  return response.data
}

export async function listPublicForms() {
  const response = await api.get<PublicForm[]>("/forms/public")
  return response.data
}

export async function getFormById(formId: string) {
  const response = await api.get<Form>(`/forms/${formId}`)
  return response.data
}

export async function createForm(data: FormCreateRequest) {
  const response = await api.post<Form>("/forms/", data)
  return response.data
}

export async function updateForm(formId: string, data: FormUpdateRequest) {
  const response = await api.patch<Form>(`/forms/${formId}`, data)
  return response.data
}

export async function archiveForm(formId: string) {
  const response = await api.delete<Form>(`/forms/${formId}`)
  return response.data
}

export async function restoreForm(formId: string) {
  const response = await api.post<Form>(`/forms/${formId}/restore`)
  return response.data
}

export async function permanentDeleteForm(formId: string) {
  const response = await api.delete(`/forms/${formId}/permanent`)
  return response.data
}

export async function getFormAnalytics(formId: string) {
  const response = await api.get(`/forms/${formId}/analytics`)
  return response.data
}

export async function exportFormCsv(formId: string) {
  const response = await api.get(`/forms/${formId}/export/csv`, {
    responseType: "text",
  })

  return response.data
}