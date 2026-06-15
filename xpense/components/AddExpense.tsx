'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Category, Medium } from '@/types'

export default function AddExpense() {
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [mediumId, setMediumId] = useState('')
  const [note, setNote] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [mediums, setMediums] = useState<Medium[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [balanceChecked, setBalanceChecked] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('balance_checked')
    if (stored) {
      const parsed = JSON.parse(stored)
      setBalanceChecked(parsed.checked)
      setLastChecked(parsed.at)
    }
    loadLists()
  }, [])

  const loadLists = async () => {
    const [{ data: cats }, { data: meds }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('mediums').select('*').order('name'),
    ])
    if (cats) { setCategories(cats); if (!categoryId) setCategoryId(String(cats[0]?.id ?? '')) }
    if (meds) { setMediums(meds); if (!mediumId) setMediumId(String(meds[0]?.id ?? '')) }
  }

  const addExpense = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      flash('Enter a valid amount', 'error')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('expenses').insert({
      amount: parseFloat(amount),
      category_id: parseInt(categoryId),
      medium_id: parseInt(mediumId),
      note: note.trim() || null,
    })
    setLoading(false)
    if (error) {
      flash('Failed to save — check connection', 'error')
    } else {
      flash('Expense added', 'success')
      setAmount('')
      setNote('')
    }
  }

  const flash = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 2500)
  }

  const toggleBalance = () => {
    const next = !balanceChecked
    const now = next ? new Date().toISOString() : null
    setBalanceChecked(next)
    setLastChecked(now)
    localStorage.setItem('balance_checked', JSON.stringify({ checked: next, at: now }))
  }

  const cardStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '1.25rem',
    marginBottom: '1rem',
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: 12,
    color: 'var(--text2)',
    marginBottom: 5,
    fontWeight: 500,
  }

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 16 }}>New expense</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={labelStyle}>Amount (৳)</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addExpense()}
              min="0"
              style={{ fontWeight: 500 }}
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Medium</label>
            <select value={mediumId} onChange={e => setMediumId(e.target.value)}>
              {mediums.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Note (optional)</label>
          <input
            type="text"
            placeholder="Brief description..."
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addExpense()}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={addExpense}
            disabled={loading}
            style={{
              background: 'var(--accent)', color: 'var(--accent-fg)',
              border: 'none', borderRadius: 8,
              padding: '9px 20px', fontSize: 14, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving…' : '+ Add expense'}
          </button>
          {msg && (
            <span style={{
              fontSize: 13,
              color: msg.type === 'success' ? 'var(--green)' : 'var(--red)',
            }}>
              {msg.text}
            </span>
          )}
        </div>
      </div>

      {/* Balance check */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>
            Balance reconciliation
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            {balanceChecked && lastChecked
              ? `Last verified ${new Date(lastChecked).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at ${new Date(lastChecked).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
              : 'Tap after verifying your wealth tracker app'
            }
          </div>
        </div>
        <button
          onClick={toggleBalance}
          style={{
            padding: '8px 16px',
            background: balanceChecked ? 'var(--green-bg)' : 'var(--bg2)',
            color: balanceChecked ? 'var(--green-text)' : 'var(--text2)',
            border: `1px solid ${balanceChecked ? 'var(--green)' : 'var(--border2)'}`,
            borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
            whiteSpace: 'nowrap' as const,
            transition: 'all 0.2s',
          }}
        >
          {balanceChecked ? '✓ Balance verified' : 'Balance checked'}
        </button>
      </div>
    </div>
  )
}
