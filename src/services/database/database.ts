import * as SQLite from "expo-sqlite"

export const db = SQLite.openDatabaseSync("smart_forms.db")

export function executeSql(sql: string) {
  db.execSync(sql)
}