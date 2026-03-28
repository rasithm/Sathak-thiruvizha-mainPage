import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, isLoggedIn } from '../lib/api'
import styles from './AdminLogin.module.css'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (isLoggedIn()) navigate('/admin/dashboard', { replace: true })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError('Enter username and password'); return }
    setLoading(true); setError('')
    try { await adminLogin(username, password); navigate('/admin/dashboard') }
    catch (err) { setError(err.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.glow} />
        <div className={styles.logo}>✦ HABIBI FEST</div>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Habibi Fest 2026 · Control Panel</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} type="text" placeholder="admin"
              value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwWrap}>
              <input className={styles.pwInput} type={showPw ? 'text' : 'password'}
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" className={styles.eyeBtn}
                onClick={() => setShowPw(s => !s)} tabIndex={-1} aria-label="Toggle password">
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className={styles.error}>⚠️ {error}</p>}
          <button type="submit" className={styles.btn}  disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <a href="/" className={styles.back}>← Back to Site</a>
      </div>
    </div>
  )
}
