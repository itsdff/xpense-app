export interface Expense {
  id: number
  amount: number
  category_id: number
  medium_id: number
  note: string | null
  created_at: string
  category?: Category
  medium?: Medium
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface Medium {
  id: number
  name: string
  created_at: string
}

export interface MonthlySummary {
  month: string
  byCategory: { name: string; total: number }[]
  byMedium: { name: string; total: number }[]
  grandTotal: number
}
