import { useCallback, useState } from "react"

import { listProjectForms } from "../api/formsApi"
import type { Form } from "../types/formTypes"

export function useProjectForms(projectId?: string) {
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadForms = useCallback(async () => {
    if (!projectId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await listProjectForms(projectId)
      setForms(data)
    } catch {
      setError("Não foi possível carregar os formulários.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [projectId])

  const refreshForms = useCallback(async () => {
    setIsRefreshing(true)
    await loadForms()
  }, [loadForms])

  return {
    forms,
    isLoading,
    isRefreshing,
    error,
    loadForms,
    refreshForms,
  }
}