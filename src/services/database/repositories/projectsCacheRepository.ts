import { db } from "../database"

export function saveProjectCache(project: any) {
  const now = new Date().toISOString()

  db.runSync(
    `
    INSERT OR REPLACE INTO projects_cache (
      id,
      data,
      updated_at
    )
    VALUES (?, ?, ?)
    `,
    [
      project.id,
      JSON.stringify(project),
      now,
    ]
  )
}

export function saveProjectsCache(projects: any[]) {
  for (const project of projects) {
    saveProjectCache(project)
  }
}

export function getCachedProject(projectId: string) {
  const result = db.getFirstSync<{ data: string }>(
    `
    SELECT data
    FROM projects_cache
    WHERE id = ?
    `,
    [projectId]
  )

  return result?.data ? JSON.parse(result.data) : null
}

export function getCachedProjects() {
  const rows = db.getAllSync<{ data: string }>(
    `
    SELECT data
    FROM projects_cache
    ORDER BY updated_at DESC
    `
  )

  return rows.map((row: { data: string }) => JSON.parse(row.data))
}