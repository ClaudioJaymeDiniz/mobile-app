import { useCallback, useState } from "react"

import {
  listArchivedProjects,
  listProjects,
} from "../api/projectsApi"
import type { Project } from "../types/projectTypes"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [active, archived] = await Promise.all([
        listProjects(),
        listArchivedProjects(),
      ])

      setProjects(active)
      setArchivedProjects(archived)
    } catch {
      setError("Não foi possível carregar os projetos.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  const refreshProjects = useCallback(async () => {
    setIsRefreshing(true)
    await loadProjects()
  }, [loadProjects])

  return {
    projects,
    archivedProjects,
    isLoading,
    isRefreshing,
    error,
    loadProjects,
    refreshProjects,
  }
}