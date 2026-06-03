import { db } from "../database"

export function saveDraft(params: {
  formId: string
  userId?: string | null
  data: Record<string, any>
}) {
  const now = new Date().toISOString()
  const id = `${params.formId}:${params.userId ?? "anonymous"}`

  db.runSync(
    `
    INSERT OR REPLACE INTO draft_responses (
      id,
      form_id,
      user_id,
      data,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      id,
      params.formId,
      params.userId ?? null,
      JSON.stringify(params.data),
      now,
    ]
  )
}

export function getDraft(formId: string, userId?: string | null) {
  const id = `${formId}:${userId ?? "anonymous"}`

  const result = db.getFirstSync<{ data: string }>(
    `
    SELECT data
    FROM draft_responses
    WHERE id = ?
    `,
    [id]
  )

  if (!result?.data) return null

  return JSON.parse(result.data) as Record<string, any>
}

export function deleteDraft(formId: string, userId?: string | null) {
  const id = `${formId}:${userId ?? "anonymous"}`

  db.runSync(
    `
    DELETE FROM draft_responses
    WHERE id = ?
    `,
    [id]
  )
}