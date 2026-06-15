'use client'

import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth'
import { useEffect, useState } from 'react'

interface NavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'add', label: 'Add', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 3v10M3 8h10"/>
    </svg>
  )},
  { id: 'log', label: 'Log', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 4h10M3 8h7M3 12h5"/>
    </svg>
  )},
  { id: 'summary', label: 'Summary', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 12l4-4 3 3 5-7"/>
    </svg>
  )},
  { id: 'manage', label: 'Manage', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="2"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2"/>
    </svg>
  )},
]

export default function Navbar({ activeTab, onTabChange }: NavProps) {
  const { theme, setTheme } = useTheme()
  const { lock } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1rem',
    }}>
      <div style={{
        maxWidth: 680, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 4,
        height: 52,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginRight: 'auto',
          color: 'var(--text)', fontSize: 15, fontWeight: 500,
        }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 28 28" fill="none">
              <path d="M6 20L14 8L22 20" stroke="var(--accent-fg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 16H19" stroke="var(--accent-fg)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          Xpense
        </div>

        {/* Tabs */}
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 10px',
              border: 'none',
              borderRadius: 8,
              background: activeTab === tab.id ? 'var(--bg3)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text2)',
              fontSize: 13, fontWeight: activeTab === tab.id ? 500 : 400,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              marginLeft: 4, padding: 6,
              border: '1px solid var(--border2)',
              borderRadius: 8, background: 'transparent',
              color: 'var(--text2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M11.4 3.2l-1.4 1.4M4.6 11.4l-1.4 1.4"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M13.5 10A6 6 0 016 2.5a6 6 0 100 11 6 6 0 007.5-3.5z"/>
              </svg>
            )}
          </button>
        )}

        {/* Lock */}
        <button
          onClick={lock}
          style={{
            padding: 6,
            border: '1px solid var(--border2)',
            borderRadius: 8, background: 'transparent',
            color: 'var(--text2)', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}
          title="Lock"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="7" width="10" height="8" rx="2"/>
            <path d="M5 7V5a3 3 0 016 0v2"/>
          </svg>
        </button>
      </div>
    </nav>
  )
}
