import axios from "axios"
import { env } from "@/src/config/env"
import { getToken } from "@/src/services/storage/tokenStorage"

export const api = axios.create({
  baseURL: env.API_URL,
})

api.interceptors.request.use(async (config) => {
  const token = await getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})