export type AnalyticsSeriesItem = {
  label: string
  count: number
}

export type AnalyticsField = {
  fieldId: string
  label: string
  type: string
  totalAnswered: number
  emptyCount: number
  chart: "pie" | "bar" | "line" | string
  series: AnalyticsSeriesItem[]
  stats?: Record<string, number> | null
}

export type DailySubmissionItem = {
  date: string
  count: number
}

export type FormAnalytics = {
  formId: string
  title: string
  totalSubmissions: number
  completionRate: number
  dailySubmissions: DailySubmissionItem[]
  fields: AnalyticsField[]
}