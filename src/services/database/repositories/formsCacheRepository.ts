import { db } from "../database"

export function saveFormCache(form: any) {
  const now = new Date().toISOString()

  db.runSync(
    `
    INSERT OR REPLACE INTO forms_cache (
      id,
      project_id,
      data,
      updated_at
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      form.id,
      form.projectId,
      JSON.stringify(form),
      now,
    ]
  )
}

export function saveFormsCache(forms: any[]) {
  for (const form of forms) {
    saveFormCache(form)
  }
}

export function getCachedForm(formId: string) {
  const result = db.getFirstSync<{ data: string }>(
    `
    SELECT data
    FROM forms_cache
    WHERE id = ?
    `,
    [formId]
  )

  return result?.data ? JSON.parse(result.data) : null
}

export function getCachedFormsByProject(projectId: string) {
  const rows = db.getAllSync<{ data: string }>(
    `
    SELECT data
    FROM forms_cache
    WHERE project_id = ?
    `,
    [projectId]
  )

  return rows.map((row: { data: string }) => JSON.parse(row.data))
}