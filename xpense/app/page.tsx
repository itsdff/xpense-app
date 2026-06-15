'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import LockScreen from '@/components/LockScreen'
import Navbar from '@/components/Navbar'
import AddExpense from '@/components/AddExpense'
import ExpenseLog from '@/components/ExpenseLog'
import MonthlySummary from '@/components/MonthlySummary'
import ManageLists from '@/components/ManageLists'

export default function Home() {
  const { isUnlocked } = useAuth()
  const [tab, setTab] = useState('add')

  if (!isUnlocked) return <LockScreen />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg2)' }}>
      <Navbar activeTab={tab} onTabChange={setTab} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '1.25rem 1rem 4rem' }}>
        {tab === 'add' && <AddExpense />}
        {tab === 'log' && <ExpenseLog />}
        {tab === 'summary' && <MonthlySummary />}
        {tab === 'manage' && <ManageLists />}
      </main>
    </div>
  )
}
