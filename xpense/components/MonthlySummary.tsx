'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const PALETTE = [
  '#378ADD','#1D9E75','#BA7517','#D4537E','#534AB7',
  '#D85A30','#639922','#888780','#E24B4A','#0F6E56',
]

interface SummaryItem { name: string; total: number }

export default function MonthlySummary() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [byCategory, setByCategory] = useState<SummaryItem[]>([])
  const [byMedium, setByMedium] = useState<SummaryItem[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [catView, setCatView] = useState<'bar' | 'donut'>('donut')
  const [medView, setMedView] = useState<'bar' | 'donut'>('bar')

  useEffect(() => { loadSummary() }, [year, month])

  const loadSummary = async () => {
    setLoading(true)
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0)
    const end = `${year}-${String(month).padStart(2, '0')}-${endDate.getDate()}`

    const { data } = await supabase
      .from('expenses')
      .select('amount, category:categories(name), medium:mediums(name)')
      .gte('created_at', start)
      .lte('created_at', end + 'T23:59:59')

    if (data) {
      const catMap: Record<string, number> = {}
      const medMap: Record<string, number> = {}
      let total = 0
      data.forEach((e: any) => {
        const cat = e.category?.name ?? 'Unknown'
        const med = e.medium?.name ?? 'Unknown'
        catMap[cat] = (catMap[cat] ?? 0) + e.amount
        medMap[med] = (medMap[med] ?? 0) + e.amount
        total += e.amount
      })
      setByCategory(Object.entries(catMap).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total))
      setByMedium(Object.entries(medMap).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total))
      setGrandTotal(total)
    }
    setLoading(false)
  }

  const monthName = new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    const next = new Date(year, month) // 1st of next month
    if (next > new Date()) return
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#a09fa0' : '#6f6e6a'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

  const barOpts = (horizontal = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    plugins: { legend: { display: false }, tooltip: {
      callbacks: { label: (ctx: any) => ` ৳${Math.round(ctx.raw).toLocaleString()}` }
    }},
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 } } },
    },
  })

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx: any) => ` ৳${Math.round(ctx.raw).toLocaleString()} (${Math.round(ctx.raw / grandTotal * 100)}%)` }
      }
    },
  }

  const ChartToggle = ({ view, setView }: { view: 'bar' | 'donut', setView: (v: 'bar' | 'donut') => void }) => (
    <div style={{ display: 'flex', gap: 4 }}>
      {(['donut', 'bar'] as const).map(v => (
        <button key={v} onClick={() => setView(v)} style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 12,
          border: '1px solid var(--border2)',
          background: view === v ? 'var(--accent)' : 'transparent',
          color: view === v ? 'var(--accent-fg)' : 'var(--text2)',
          cursor: 'pointer', fontFamily: 'inherit', fontWeight: view === v ? 500 : 400,
        }}>
          {v === 'donut' ? 'Donut' : 'Bar'}
        </button>
      ))}
    </div>
  )

  const SummaryChart = ({ items, view }: { items: SummaryItem[], view: 'bar' | 'donut' }) => {
    const labels = items.map(i => i.name)
    const data = items.map(i => i.total)
    const colors = items.map((_, i) => PALETTE[i % PALETTE.length])
    const dataset = { data, backgroundColor: colors, borderWidth: 0 }

    if (items.length === 0) return (
      <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: '2rem 0' }}>
        No data this month
      </div>
    )

    return (
      <div>
        {view === 'donut' ? (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ height: 200, width: 200, flexShrink: 0 }}>
              <Doughnut data={{ labels, datasets: [dataset] }} options={donutOpts} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' as const }}>৳{Math.round(item.total).toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 32, textAlign: 'right' }}>{Math.round(item.total / grandTotal * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: Math.max(180, items.length * 36 + 40) }}>
            <Bar
              data={{ labels, datasets: [{ ...dataset, borderRadius: 4 }] }}
              options={barOpts(true) as any}
            />
          </div>
        )}
      </div>
    )
  }

  const cardStyle = {
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '1.25rem', marginBottom: '0.75rem',
  }

  return (
    <div>
      {/* Month selector */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{monthName}</div>
          {loading ? (
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Loading…</div>
          ) : (
            <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', marginTop: 4 }}>
              ৳{Math.round(grandTotal).toLocaleString()}
            </div>
          )}
        </div>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
        </button>
      </div>

      {/* By category */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0 }}>By category</h3>
          <ChartToggle view={catView} setView={setCatView} />
        </div>
        <SummaryChart items={byCategory} view={catView} />
      </div>

      {/* By medium */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: 0 }}>By payment medium</h3>
          <ChartToggle view={medView} setView={setMedView} />
        </div>
        <SummaryChart items={byMedium} view={medView} />
      </div>
    </div>
  )
}
