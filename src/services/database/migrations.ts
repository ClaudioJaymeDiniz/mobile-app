import { db } from "./database"

export function runMigrations() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS projects_cache (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS forms_cache (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS draft_responses (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL,
      user_id TEXT,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_forms_cache_project_id
    ON forms_cache(project_id);

    CREATE INDEX IF NOT EXISTS idx_draft_responses_form_id
    ON draft_responses(form_id);

    CREATE INDEX IF NOT EXISTS idx_sync_queue_status
    ON sync_queue(status);
  `)

  console.log("✅ SQLite migrations executadas")
}