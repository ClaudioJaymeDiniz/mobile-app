import { db } from "../database"

export type SyncQueueItem = {
  id: number
  endpoint: string
  method: "POST" | "PATCH" | "DELETE"
  payload: string
  status: "pending" | "processing" | "synced" | "error"
  attempts: number
  last_error?: string | null
  created_at: string
  updated_at: string
}

export function addToSyncQueue(params: {
  endpoint: string
  method: "POST" | "PATCH" | "DELETE"
  payload: unknown
}) {
  const now = new Date().toISOString()

  db.runSync(
    `
    INSERT INTO sync_queue (
      endpoint,
      method,
      payload,
      status,
      attempts,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, 'pending', 0, ?, ?)
    `,
    [
      params.endpoint,
      params.method,
      JSON.stringify(params.payload),
      now,
      now,
    ]
  )
}

export function getPendingSyncItems() {
  return db.getAllSync<SyncQueueItem>(
    `
    SELECT *
    FROM sync_queue
    WHERE status = 'pending'
    ORDER BY created_at ASC
    `
  )
}

export function markSyncItemAsSynced(id: number) {
  db.runSync(
    `
    UPDATE sync_queue
    SET status = 'synced',
        updated_at = ?
    WHERE id = ?
    `,
    [new Date().toISOString(), id]
  )
}

export function markSyncItemAsError(id: number, error: string) {
  db.runSync(
    `
    UPDATE sync_queue
    SET status = 'error',
        attempts = attempts + 1,
        last_error = ?,
        updated_at = ?
    WHERE id = ?
    `,
    [error, new Date().toISOString(), id]
  )
}