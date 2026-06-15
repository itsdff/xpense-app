'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Category, Medium } from '@/types'

export default function ManageLists() {
  const [categories, setCategories] = useState<Category[]>([])
  const [mediums, setMediums] = useState<Medium[]>([])
  const [newCat, setNewCat] = useState('')
  const [newMed, setNewMed] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [{ data: cats }, { data: meds }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('mediums').select('*').order('name'),
    ])
    if (cats) setCategories(cats)
    if (meds) setMediums(meds)
  }

  const addCategory = async () => {
    const name = newCat.trim()
    if (!name) return
    setLoading(true)
    await supabase.from('categories').insert({ name })
    setNewCat('')
    await loadAll()
    setLoading(false)
  }

  const addMedium = async () => {
    const name = newMed.trim()
    if (!name) return
    setLoading(true)
    await supabase.from('mediums').insert({ name })
    setNewMed('')
    await loadAll()
    setLoading(false)
  }

  const deleteCategory = async (id: number) => {
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const deleteMedium = async (id: number) => {
    await supabase.from('mediums').delete().eq('id', id)
    setMediums(prev => prev.filter(m => m.id !== id))
  }

  const ListCard = ({
    title, items, newValue, setNewValue, onAdd, onDelete, placeholder
  }: {
    title: string
    items: { id: number; name: string }[]
    newValue: string
    setNewValue: (v: string) => void
    onAdd: () => void
    onDelete: (id: number) => void
    placeholder: string
  }) => (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1.25rem',
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 14 }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={item.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: 14, color: 'var(--text)',
          }}>
            <span>{item.name}</span>
            {items.length > 1 && (
              <button
                onClick={() => onDelete(item.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3)', padding: '2px 6px', borderRadius: 4,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={el => (el.currentTarget.style.color = 'var(--red)')}
                onMouseLeave={el => (el.currentTarget.style.color = 'var(--text3)')}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 8h10"/>
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder={placeholder}
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          style={{ flex: 1 }}
        />
        <button
          onClick={onAdd}
          disabled={loading || !newValue.trim()}
          style={{
            padding: '9px 14px',
            background: 'var(--accent)', color: 'var(--accent-fg)',
            border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: !newValue.trim() ? 0.5 : 1,
            whiteSpace: 'nowrap' as const,
          }}
        >
          Add
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      <ListCard
        title="Expense categories"
        items={categories}
        newValue={newCat}
        setNewValue={setNewCat}
        onAdd={addCategory}
        onDelete={deleteCategory}
        placeholder="New category…"
      />
      <ListCard
        title="Payment mediums"
        items={mediums}
        newValue={newMed}
        setNewValue={setNewMed}
        onAdd={addMedium}
        onDelete={deleteMedium}
        placeholder="New medium…"
      />
    </div>
  )
}
