import { api } from "@/src/services/api/api"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "../types/authTypes"

export async function register(data: RegisterRequest) {
  const response = await api.post<User>("/auth/register", data)
  return response.data
}

export async function login(data: LoginRequest) {
  const formData = new URLSearchParams()

  formData.append("username", data.email)
  formData.append("password", data.password)

  const response = await api.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return response.data
}

export async function getMe() {
  const response = await api.get<User>("/auth/me")
  return response.data
}

export async function recoverPassword(email: string) {
  const response = await api.post("/auth/recover-password", {
    email,
  })

  return response.data
}