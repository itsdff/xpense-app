'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/lib/auth'

export default function LockScreen() {
  const { unlock } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tryUnlock = () => {
    const ok = unlock(password)
    if (!ok) {
      setError(true)
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div
        className="flex flex-col items-center gap-6 w-full max-w-xs px-6"
        style={{ animation: shake ? 'shake 0.4s ease' : undefined }}
      >
        {/* Logo mark */}
        <div style={{
          width: 56, height: 56,
          background: 'var(--accent)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 20L14 8L22 20" stroke="var(--accent-fg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 16H19" stroke="var(--accent-fg)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)', margin: 0 }}>Xpense</h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Enter password to continue</p>
        </div>

        <div style={{ width: '100%' }}>
          <input
            ref={inputRef}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && tryUnlock()}
            autoFocus
            style={{
              borderColor: error ? 'var(--red)' : undefined,
              textAlign: 'center',
              letterSpacing: '0.1em',
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: 'var(--red)', textAlign: 'center', marginTop: 6 }}>
              Incorrect password
            </p>
          )}
        </div>

        <button
          onClick={tryUnlock}
          style={{
            width: '100%', padding: '10px',
            background: 'var(--accent)', color: 'var(--accent-fg)',
            border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Unlock
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
