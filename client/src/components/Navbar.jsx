import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import sathakLogoFull from '../img/sathak-logo-full1.png'
import sathakLogoIcon from '../img/sathak-logo-icon1.png'
import styles from './Navbar.module.css'

export default function Navbar({ onRegister, introActive = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/home'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleRegister = useCallback((e) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setMenuOpen(false)
    if (!isHome) {
      navigate('/home')
      setTimeout(() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }), 400)
    } else if (onRegister) {
      onRegister()
    } else {
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isHome, navigate, onRegister])

  const handleNavLink = useCallback((href, e) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setMenuOpen(false)
    const sectionId = href.replace('#', '')
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/home')
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 400)
    }
  }, [isHome, navigate])

  const toggleMenu = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(m => !m)
  }, [])

  const navLinks = [
    { label: 'Events',   href: '#events'   },
    { label: 'Schedule', href: '#schedule' },
    { label: 'About',    href: '#about'    },
  ]

  const navStyle = introActive ? { opacity: 0, pointerEvents: 'none' } : {}

  return (
    <>
      {/* Backdrop — closes menu when tapping outside on mobile */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        style={navStyle}
      >
        <div className={styles.inner}>
          <Link to="/home" className={styles.logo} onClick={closeMenu}>
            <img src={sathakLogoIcon} alt="Thiruvizha Symbol" className={styles.logoSymbol} />
            <img src={sathakLogoFull} alt="Sathak Thiruvizha"  className={styles.logoWordmark} />
          </Link>

          <div className={styles.links}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className={styles.link}
                onClick={(e) => handleNavLink(l.href, e)}>{l.label}</a>
            ))}
            <Link to="/leaderboard" className={styles.link}>Leaderboard</Link>
            <Link to="/organisers"  className={styles.link}>Organisers</Link>
          </div>

          <div className={styles.actions}>
            <Link to="/admin" className={styles.adminBtn}>Admin</Link>
            <button type="button" className={styles.cta} onClick={handleRegister}>
              <span>Register Now</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Slide-down mobile drawer */}
        <div
          id="mobile-drawer"
          className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
          aria-hidden={!menuOpen}
        >
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className={styles.drawerLink}
              onClick={(e) => handleNavLink(l.href, e)}>{l.label}</a>
          ))}
          <Link to="/leaderboard" className={styles.drawerLink} onClick={closeMenu}>Leaderboard</Link>
          <Link to="/organisers"  className={styles.drawerLink} onClick={closeMenu}>Organisers</Link>
          <Link to="/admin"       className={styles.drawerLink} onClick={closeMenu}>Admin</Link>
          <button type="button" className={styles.drawerCta} onClick={handleRegister}>Register Now →</button>
        </div>
      </nav>
    </>
  )
}
