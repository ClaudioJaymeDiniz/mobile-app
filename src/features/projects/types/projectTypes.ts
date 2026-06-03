export type Project = {
  id: string
  name: string
  description?: string | null
  logoUrl?: string | null
  themeColor: string
  isPublic: boolean
  ownerId: string
  createdAt: string
  deletedAt?: string | null
}

export type ProjectCreateRequest = {
  name: string
  description?: string
  logoUrl?: string | null
  themeColor?: string
  isPublic?: boolean
}

export type ProjectUpdateRequest = Partial<ProjectCreateRequest>