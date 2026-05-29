import { create } from "zustand"

import { getMe, login, register } from "../api/authApi"
import type { LoginRequest, RegisterRequest, User } from "../types/authTypes"
import {
  getToken,
  removeToken,
  saveToken,
} from "@/src/services/storage/tokenStorage"

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  signIn: (data: LoginRequest) => Promise<void>
  signUp: (data: RegisterRequest) => Promise<void>
  loadSession: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  signIn: async (data) => {
    set({ isLoading: true })

    try {
      const auth = await login(data)

      await saveToken(auth.access_token)

      const user = await getMe()

      set({
        token: auth.access_token,
        user,
        isAuthenticated: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (data) => {
    set({ isLoading: true })

    try {
      await register(data)
      const auth = await login({
        email: data.email,
        password: data.password,
      })

      await saveToken(auth.access_token)

      const user = await getMe()

      set({
        token: auth.access_token,
        user,
        isAuthenticated: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  loadSession: async () => {
    set({ isLoading: true })

    try {
      const token = await getToken()

      if (!token) {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
        return
      }

      const user = await getMe()

      set({
        token,
        user,
        isAuthenticated: true,
      })
    } catch {
      await removeToken()

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    await removeToken()

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    })
  },
}))