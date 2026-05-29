export type User = {
  id: string
  email: string
  name?: string | null
  provider: string
  createdAt: string
  globalMetadata?: unknown
}

export type RegisterRequest = {
  name?: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  token_type: string
}