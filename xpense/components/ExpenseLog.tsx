'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Expense } from '@/types'

export default function ExpenseLog() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 30

  const load = useCallback(async (reset = false) => {
    setLoading(true)
    const from = reset ? 0 : page * PAGE_SIZE
    const { data, error } = await supabase
      .from('expenses')
      .select('*, category:categories(id,name,created_at), medium:mediums(id,name,created_at)')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (!error && data) {
      setExpenses(prev => reset ? data : [...prev, ...data])
      setHasMore(data.length === PAGE_SIZE)
      if (!reset) setPage(p => p + 1)
    }
    setLoading(false)
  }, [page])

  useEffect(() => { load(true) }, [])

  const deleteExpense = async (id: number) => {
    await supabase.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const grouped = expenses.reduce((acc, e) => {
    const d = new Date(e.created_at)
    const key = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {} as Record<string, Expense[]>)

  const rowStyle = {
    display: 'flex', alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
    gap: 10,
  }

  const badgeStyle = (color: string, bg: string) => ({
    display: 'inline-flex',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    background: bg,
    color: color,
    whiteSpace: 'nowrap' as const,
  })

  if (!loading && expenses.length === 0) {
    return (
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '3rem 1.25rem', textAlign: 'center',
        color: 'var(--text2)', fontSize: 14,
      }}>
        No expenses yet — add your first one.
      </div>
    )
  }

  return (
    <div>
      {Object.entries(grouped).map(([date, items]) => {
        const dayTotal = items.reduce((s, e) => s + e.amount, 0)
        return (
          <div key={date} style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '0.75rem 1.25rem', marginBottom: '0.75rem',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: 8, marginBottom: 2,
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)' }}>{date}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                ৳{Math.round(dayTotal).toLocaleString()}
              </span>
            </div>
            {items.map((e, i) => (
              <div key={e.id} style={{ ...rowStyle, borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                    <span style={badgeStyle('var(--text2)', 'var(--bg3)')}>
                      {e.category?.name ?? '—'}
                    </span>
                    <span style={badgeStyle('var(--blue-text)', 'var(--blue-bg)')}>
                      {e.medium?.name ?? '—'}
                    </span>
                    {e.note && <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: 180 }}>{e.note}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
                    {new Date(e.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', minWidth: 64, textAlign: 'right' }}>
                  ৳{Math.round(e.amount).toLocaleString()}
                </div>
                <button
                  onClick={() => deleteExpense(e.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text3)', padding: '4px 6px', borderRadius: 6,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={el => (el.currentTarget.style.color = 'var(--red)')}
                  onMouseLeave={el => (el.currentTarget.style.color = 'var(--text3)')}
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 4h10M6 4V3a1 1 0 012 0v1M5 4l.5 9h5l.5-9"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      })}
      {hasMore && (
        <button
          onClick={() => load()}
          disabled={loading}
          style={{
            display: 'block', width: '100%',
            padding: '10px', marginTop: 4,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 10, fontSize: 13, color: 'var(--text2)',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  )
}
