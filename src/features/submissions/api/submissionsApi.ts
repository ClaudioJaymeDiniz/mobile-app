import { api } from "@/src/services/api/api"
import type {
  Submission,
  SubmissionCreateRequest,
} from "../types/submissionTypes.ts"

export async function createSubmission(data: SubmissionCreateRequest) {
  const response = await api.post<Submission>("/submissions/", data)
  return response.data
}

export async function listFormSubmissions(formId: string) {
  const response = await api.get<Submission[]>(`/submissions/form/${formId}`)
  return response.data
}