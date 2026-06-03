export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "image"
  | "file"

export type FormField = {
  fieldId?: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  options?: string[]
}

export type Form = {
  id: string
  title: string
  description?: string | null
  isPublic: boolean
  structure: FormField[]
  projectId: string
  createdAt: string
  deletedAt?: string | null
  submissionCount?: number
}

export type FormCreateRequest = {
  title: string
  description?: string
  isPublic?: boolean
  projectId: string
  structure: FormField[]
}