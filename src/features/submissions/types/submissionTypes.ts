export type Submission = {
  id: string
  userId: string
  formId: string
  formData: Record<string, any>
  createdAt: string
  user?: {
    name?: string | null
    email: string
  }
}

export type SubmissionCreateRequest = {
  id: string
  formId: string
  formData: Record<string, any>
}