import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Countdown from '../components/Countdown'
import EventCard from '../components/EventCard'
import useScrollReveal from '../hooks/useScrollReveal'
import { CONFIG, DAYS, CATEGORY_FILTERS, STATS, CATEGORY_COLORS } from '../lib/config'
import { getEvents } from '../lib/api'
import frontImg from '../img/FRONT-MSAJCE.png'
import backImg  from '../img/BACK-MSAJCE.png'
import rasithProfile from '../img/rasith-profile.jpg'
import styles from './HomePage.module.css'

// ── Animated stat counter hook ────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [count, setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const numeric = parseInt(String(target).replace(/\D/g, ''), 10)
    if (!numeric) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * numeric))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])

  const suffix = String(target).replace(/[\d,]/g, '')
  return { ref, display: count.toLocaleString() + suffix }
}

function StatCard({ value, label, delay, index, displayOverride }) {
  const { ref, display } = useCountUp(value)
  return (
    <div ref={ref} className={`${styles.statCard} reveal`} style={{ transitionDelay: `${delay}s` }}>
      <div className={styles.statIcon}>{['🎓', '⚡', '🏆', '🏛️'][index] || '✦'}</div>
      <div className={styles.statValue}>{displayOverride || display}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

const TICKER_ITEMS = [
  'Grand Opening', 'Code Blitz', 'Robo Race', 'Startup Pitch',
  'Cultural Night', 'Habibi-A-Thon', 'Street Dance Battle', 'Ramp Royale',
  'Champions Gala', 'Paper Presentation', '₹25L+ Prize Pool', 'April 6–17 · Chennai', 'Sathak Thiruvizha 2026',
]

function MarqueeTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className={styles.marqueeWrap} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {items.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            {item}
            <span className={styles.marqueeDot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── World Canvas Background (same as LandingPage) ─────────────
function WorldCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    let W, H, resizeTimer, worldRaf

    const resize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth
        H = canvas.height = window.innerHeight
      }, 100)
    }
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
    window.addEventListener('resize', resize, { passive: true })

    const getT   = () => { const max = document.body.scrollHeight - window.innerHeight; return max > 0 ? Math.min(window.scrollY / max, 1) : 0 }
    const lerp   = (a, b, t) => a + (b - a) * t
    const clamp  = (v, a, b) => Math.max(a, Math.min(b, v))
    const easeIO = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const SKY = [
      { top: '#0c0420', mid: '#7a2c88', bot: '#ff9040' },
      { top: '#110830', mid: '#581858', bot: '#b05030' },
      { top: '#08041c', mid: '#2a104a', bot: '#4a2060' },
      { top: '#040118', mid: '#12062a', bot: '#200840' },
      { top: '#000008', mid: '#05021a', bot: '#0a0530' },
    ]
    const SKY_T = [0, .25, .5, .75, 1]
    const hx = h => { const v = parseInt(h.slice(1), 16); return [v >> 16, (v >> 8) & 255, v & 255] }
    const lerpHex = (a, b, t) => { const ca = hx(a), cb = hx(b); return `rgb(${lerp(ca[0],cb[0],t)|0},${lerp(ca[1],cb[1],t)|0},${lerp(ca[2],cb[2],t)|0})` }
    const getSky = t => {
      for (let i = 0; i < SKY_T.length - 1; i++) {
        if (t <= SKY_T[i + 1]) { const f = (t - SKY_T[i]) / (SKY_T[i + 1] - SKY_T[i]); return { top: lerpHex(SKY[i].top, SKY[i+1].top, f), mid: lerpHex(SKY[i].mid, SKY[i+1].mid, f), bot: lerpHex(SKY[i].bot, SKY[i+1].bot, f) } }
      }
      return SKY[SKY.length - 1]
    }

    const STARS = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * .72, r: Math.random() * 1.9 + .4, tw: Math.random() * Math.PI * 2, ts: Math.random() * .04 + .01 }))
    let shoots = []
    const shootInt = setInterval(() => { shoots.push({ x: Math.random() * .85 + .05, y: Math.random() * .3, vx: .007 + Math.random() * .009, vy: .003 + Math.random() * .005, life: 1, len: .09 + Math.random() * .13 }) }, 7000)

    const LANTERNS = Array.from({ length: 5 }, () => ({ x: Math.random(), y: .5 + Math.random() * .7, spd: .00038 + Math.random() * .0004, sw: Math.random() * Math.PI * 2, sws: .012 + Math.random() * .016, sz: 9 + Math.random() * 10, col: ['#ffd700','#ff8c00','#ffaa44'][Math.floor(Math.random() * 3)] }))
    const PARTS = Array.from({ length: 20 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0003, vy: -(Math.random() * .0006 + .0001), r: Math.random() * 2.5 + .5, life: Math.random(), dec: .003 + Math.random() * .005, hue: Math.random() * 60 + 10 }))

    const IMG_CAMPUS = new Image(); IMG_CAMPUS.loading = 'eager'; IMG_CAMPUS.src = frontImg
    const IMG_STAGE  = new Image(); IMG_STAGE.loading  = 'eager'; IMG_STAGE.src  = backImg

    function drawWorld() {
      const t = getT()
      ctx.clearRect(0, 0, W, H)
      const campusAlpha = clamp(1 - t / .38, 0, 1)
      const stageAlpha  = clamp((t - .22) / .30, 0, 1) * clamp(1 - (t - .55) / .28, 0, 1)
      const sc = getSky(t)
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, sc.top); g.addColorStop(.5, sc.mid); g.addColorStop(1, sc.bot)
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      if (campusAlpha > 0.01 && IMG_CAMPUS.complete) {
        ctx.save(); ctx.globalAlpha = campusAlpha
        const py = window.scrollY * 0.18, sc2 = 1.08, iw = W * sc2, ih = H * sc2
        ctx.drawImage(IMG_CAMPUS, (W - iw) / 2, (H - ih) / 2 - py * campusAlpha, iw, ih)
        const ov = ctx.createLinearGradient(0, 0, 0, H)
        ov.addColorStop(0, 'rgba(5,2,25,.45)'); ov.addColorStop(.45, 'rgba(5,2,25,.08)'); ov.addColorStop(.75, 'rgba(5,2,25,.50)'); ov.addColorStop(1, 'rgba(0,0,10,.97)')
        ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
        const sv = ctx.createLinearGradient(0, 0, W, 0)
        sv.addColorStop(0, 'rgba(80,0,60,.28)'); sv.addColorStop(.35, 'transparent'); sv.addColorStop(.65, 'transparent'); sv.addColorStop(1, 'rgba(40,0,90,.22)')
        ctx.fillStyle = sv; ctx.fillRect(0, 0, W, H); ctx.restore()
      }

      if (stageAlpha > 0.01 && IMG_STAGE.complete) {
        ctx.save(); ctx.globalAlpha = stageAlpha
        const sc3 = 1.04 + (t - .22) * .04, iw2 = W * sc3, ih2 = H * sc3
        ctx.drawImage(IMG_STAGE, (W - iw2) / 2, (H - ih2) / 2, iw2, ih2)
        const ov2 = ctx.createLinearGradient(0, 0, 0, H)
        ov2.addColorStop(0, 'rgba(2,1,18,.55)'); ov2.addColorStop(.4, 'rgba(2,1,18,.15)'); ov2.addColorStop(.8, 'rgba(2,1,18,.60)'); ov2.addColorStop(1, 'rgba(0,0,8,.97)')
        ctx.fillStyle = ov2; ctx.fillRect(0, 0, W, H); ctx.restore()
      }

      const stA = clamp((t - .10) / .30, 0, 1)
      if (stA > 0.01) STARS.forEach(s => { s.tw += s.ts; ctx.save(); ctx.globalAlpha = stA * (0.4 + 0.6 * Math.abs(Math.sin(s.tw))); ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 7; ctx.fill(); ctx.restore() })

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]; s.x += s.vx; s.y += s.vy; s.life -= .022
        if (s.life <= 0) { shoots.splice(i, 1); continue }
        ctx.save(); ctx.globalAlpha = stA * s.life * .85; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.shadowColor = '#cce'; ctx.shadowBlur = 10
        ctx.beginPath(); ctx.moveTo(s.x * W, s.y * H); ctx.lineTo((s.x - s.len) * W, (s.y - s.len * .5) * H); ctx.stroke(); ctx.restore()
      }

      const moonT = clamp((t - 0.28) / (0.60 - 0.28), 0, 1)
      if (moonT > 0.01) {
        const em = easeIO(moonT), mx = W * lerp(0.88, 0.72, em), my = H * lerp(0.82, 0.14, em), mr = lerp(28, 52, em)
        ctx.save(); ctx.globalAlpha = Math.min(1, moonT * 2.2)
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 6.5); halo.addColorStop(0, 'rgba(180,210,255,.18)'); halo.addColorStop(.4, 'rgba(130,170,240,.07)'); halo.addColorStop(1, 'transparent'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(mx, my, mr * 6.5, 0, Math.PI * 2); ctx.fill()
        const ig = ctx.createRadialGradient(mx, my, mr * .8, mx, my, mr * 2); ig.addColorStop(0, 'rgba(200,220,255,.12)'); ig.addColorStop(1, 'transparent'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(mx, my, mr * 2, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#e8f0ff'; ctx.shadowColor = '#b0c8ff'; ctx.shadowBlur = 45; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill()
        ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.87)'; ctx.beginPath(); ctx.arc(mx + mr * .40, my - mr * .10, mr * .90, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = Math.min(1, moonT * 2.2) * .3
        ;[[-.25,-.22,.11],[.14,.12,.07],[-.09,.26,.055],[.22,-.18,.044]].forEach(([ddx,ddy,cr]) => { ctx.fillStyle = 'rgba(120,150,210,.55)'; ctx.beginPath(); ctx.arc(mx + ddx * mr, my + ddy * mr, cr * mr, 0, Math.PI * 2); ctx.fill() })
        if (moonT > .4) { ctx.globalAlpha = (moonT - .4) * .7; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * 0.8, dist = mr * (2.2 + i * .32); ctx.fillStyle = '#fff'; ctx.shadowColor = '#aaccff'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(mx + Math.cos(a) * dist, my + Math.sin(a) * dist, 1.2 + i * .1, 0, Math.PI * 2); ctx.fill() } }
        ctx.restore()
      }

      const lnA = clamp(t < .12 ? 0 : t > .70 ? 1 - (t - .70) / .18 : (t - .12) / .16, 0, 1)
      if (lnA > .01) LANTERNS.forEach(l => { l.y -= l.spd; l.sw += l.sws; if (l.y < -.18) { l.y = 1.12; l.x = Math.random() } const lx = (l.x + Math.sin(l.sw) * .022) * W, ly = l.y * H; ctx.save(); ctx.globalAlpha = lnA * .88; const gl = ctx.createRadialGradient(lx, ly, 0, lx, ly, l.sz * 3.2); gl.addColorStop(0, l.col + 'bb'); gl.addColorStop(1, 'transparent'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(lx, ly, l.sz * 3.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = l.col; ctx.shadowColor = l.col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(lx, ly, l.sz * .55, l.sz * .82, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = lnA * .4; ctx.strokeStyle = 'rgba(255,220,150,.5)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(lx, ly + l.sz * .82); ctx.lineTo(lx, ly + l.sz * 1.5); ctx.stroke(); ctx.restore() })

      PARTS.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= p.dec; if (p.life <= 0) { p.x = Math.random(); p.y = .88 + Math.random() * .12; p.vx = (Math.random() - .5) * .0003; p.vy = -(Math.random() * .0006 + .0001); p.life = .8 + Math.random() * .2; p.hue = t < .42 ? Math.random() * 60 + 10 : Math.random() * 280 + 160 } ctx.save(); ctx.globalAlpha = p.life * .65; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsl(${p.hue},100%,70%)`; ctx.shadowColor = `hsl(${p.hue},100%,70%)`; ctx.shadowBlur = 9; ctx.fill(); ctx.restore() })

      const hgC = t < .4 ? `rgba(255,${(140 - t * 280)|0},30,${.4 - t * .18})` : `rgba(80,20,${180 + t * 40|0},${Math.max(.06, .18 - t * .1)})`
      const hg = ctx.createRadialGradient(W * .5, H, 0, W * .5, H, W * .72); hg.addColorStop(0, hgC); hg.addColorStop(1, 'transparent'); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H)

      if (!document.hidden) worldRaf = requestAnimationFrame(drawWorld)
    }

    let imgLoaded = 0
    const onImgLoad = () => { imgLoaded++; if (imgLoaded >= 2) drawWorld() }
    IMG_CAMPUS.onload = onImgLoad; IMG_STAGE.onload = onImgLoad
    if (IMG_CAMPUS.complete) onImgLoad()
    if (IMG_STAGE.complete) onImgLoad()
    if (imgLoaded < 2) setTimeout(drawWorld, 200)

    return () => {
      cancelAnimationFrame(worldRaf)
      clearInterval(shootInt)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        willChange: 'transform',
      }}
    />
  )
}

// ── Scroll Progress Bar (same as LandingPage) ─────────────────
function ScrollProgressBar() {
  const barRef = useRef(null)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      bar.style.width = (max > 0 ? window.scrollY / max : 0) * 100 + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed', top: 0, left: 0, height: 3,
        background: 'linear-gradient(90deg,#ff6b35,#ff007f,#bf00ff,#00f5ff)',
        zIndex: 9998, width: 0, pointerEvents: 'none', transition: 'width 0.1s',
      }}
    />
  )
}

export default function HomePage() {
  const [activeDay,      setActiveDay]      = useState('day1')
  const [activeCategory, setActiveCategory] = useState('all')
  const [events,         setEvents]         = useState([])
  const [loadingEvents,  setLoadingEvents]  = useState(true)
  const [showAllEvents,  setShowAllEvents]  = useState(false)
  const [isMobile,       setIsMobile]       = useState(false)
  const [showIntro, setShowIntro] = useState(() => {
    const alreadyShown = sessionStorage.getItem('hbl-intro-shown') === '1'
    return !alreadyShown
  })

  useScrollReveal()

  // Track mobile breakpoint reactively
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Reset "see more" when day or category changes
  useEffect(() => { setShowAllEvents(false) }, [activeDay, activeCategory])

  const activeDayIndex = DAYS.findIndex(d => d.id === activeDay)

  const tabsRef = useRef(null)

  const scrollTabIntoView = (idx) => {
    if (!tabsRef.current) return
    const tabs = tabsRef.current.querySelectorAll('button[data-tab]')
    if (tabs[idx]) {
      tabs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  const goToPrevDay = (e) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    if (activeDayIndex > 0) {
      setActiveDay(DAYS[activeDayIndex - 1].id)
      setTimeout(() => scrollTabIntoView(activeDayIndex - 1), 50)
    }
  }
  const goToNextDay = (e) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    if (activeDayIndex < DAYS.length - 1) {
      setActiveDay(DAYS[activeDayIndex + 1].id)
      setTimeout(() => scrollTabIntoView(activeDayIndex + 1), 50)
    }
  }

  // Fetch events from backend whenever day or category changes
  useEffect(() => {
    setLoadingEvents(true)
    getEvents({ day: activeDay, category: activeCategory })
      .then(data => setEvents(data))
      .catch(err => {
        console.error('Failed to fetch events:', err)
        setEvents([])
      })
      .finally(() => setLoadingEvents(false))
  }, [activeDay, activeCategory])

  const scrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar — same as landing page */}
      <ScrollProgressBar />

      {/* Fixed canvas background — same animation as landing page */}
      <WorldCanvas />

      {/* Navbar is hidden behind intro overlay while animation plays */}
      <Navbar onRegister={scrollToEvents} introActive={showIntro} />
      {showIntro && <IntroOverlay onDone={() => setShowIntro(false)} />}

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section id="home" className={styles.hero}>
        {/* Collage photos are now in WorldCanvas — only gradient overlays needed */}
        <div className={styles.heroGradient} />

        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>MSAJCE · 25th Anniversary Edition</span>
            <span className={styles.heroBadgeSep}>·</span>
            <span>April 6–17, 2026</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>Sathak</span>
            <span className={styles.heroLine2}>Thiruvizha</span>
            <span className={styles.heroLine3}>
              <span className={styles.heroYear}>2026</span>
            </span>
          </h1>

          <p className={styles.heroTagline}>{CONFIG.TAGLINE}</p>

          <div className={styles.heroCtas}>
            <button type="button" className={styles.heroCtaPrimary} onClick={scrollToEvents} data-hover>
              Register Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            <a href="#events" className={styles.heroCtaSecondary} data-hover>
              View Events
            </a>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardClip}>
              <div className={styles.heroCardGlow} />
            </div>
            <p className={styles.heroCardLabel}>Festival begins in</p>
            <Countdown />
            <div className={styles.heroCardDivider} />
            <div className={styles.heroCardMeta}>
              <div className={styles.heroCardMetaItem}>
                <span className={styles.heroCardMetaNum}>25+</span>
                <span className={styles.heroCardMetaLbl}>Events</span>
              </div>
              <div className={styles.heroCardMetaItem}>
                <span className={styles.heroCardMetaNum}>10</span>
                <span className={styles.heroCardMetaLbl}>Days</span>
              </div>
              <div className={styles.heroCardMetaItem}>
                <span className={styles.heroCardMetaNum}>₹25L+</span>
                <span className={styles.heroCardMetaLbl}>Prizes</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollMouse}><div className={styles.scrollDot} /></div>
          <p>Scroll</p>
        </div>
      </section>

      <MarqueeTicker />

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} delay={i * 0.12} index={i} displayOverride={s.display} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EVENTS — fetch from backend
      ══════════════════════════════════════ */}
      <section id="events" className={`section ${styles.eventsSection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`}>
            <p className="section-label">✦ Events</p>
            <h2 className={styles.sectionTitle}>
              Choose Your<br />
              <span className="gradient-gold">Arena</span>
            </h2>
            <p className={styles.sectionDesc}>
              25+ competitions across 10 days — technical, cultural, and special.
              One stage. Your moment.
            </p>
          </div>

          {/* Day Tabs with Arrow Navigation */}
          <div className={`${styles.dayTabsWrap} reveal`}>
            <button
              type="button"
              className={`${styles.dayArrow} ${activeDayIndex === 0 ? styles.dayArrowDisabled : ''}`}
              onClick={goToPrevDay}
              aria-label="Previous day"
              disabled={activeDayIndex === 0}
            >
              ‹
            </button>

            <div className={styles.dayTabs} ref={tabsRef}>
              {DAYS.map(day => (
                <button
                  type="button"
                  key={day.id}
                  className={`${styles.dayTab} ${activeDay === day.id ? styles.dayTabActive : ''}`}
                  data-tab={day.id}
                  style={{ '--day-color': day.accent }}
                  onClick={() => setActiveDay(day.id)}
                  data-hover
                >
                  <span className={styles.dayTabNum}>{day.label}</span>
                  <span className={styles.dayTabDate}>{day.date}</span>
                  <span className={styles.dayTabTheme}>{day.theme}</span>
                  {activeDay === day.id && <span className={styles.dayTabIndicator} />}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`${styles.dayArrow} ${activeDayIndex === DAYS.length - 1 ? styles.dayArrowDisabled : ''}`}
              onClick={goToNextDay}
              aria-label="Next day"
              disabled={activeDayIndex === DAYS.length - 1}
            >
              ›
            </button>
          </div>

          {/* Category pills */}
          <div className={`${styles.catFilter} reveal`}>
            {CATEGORY_FILTERS.map(cat => (
              <button
                type="button"
                key={cat.id}
                className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                data-hover
                style={activeCategory === cat.id ? { '--cat-active': CATEGORY_COLORS[cat.id] || '#FFD700' } : {}}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>


          {/* Event Cards */}
          <div className={styles.eventsGrid}>
            {loadingEvents ? (
              <div className={styles.noEvents}>
                <div style={{ textAlign: 'center', opacity: 0.5 }}>Loading events...</div>
              </div>
            ) : events.length > 0 ? (
              <>
                {(isMobile && !showAllEvents ? events.slice(0, 4) : events).map((ev, i) => (
                  <EventCard key={ev._id} event={ev} delay={i * 0.07} />
                ))}
                {isMobile && !showAllEvents && events.length > 4 && (
                  <button
                    type="button"
                    className={styles.showMoreEventsBtn}
                    onClick={() => setShowAllEvents(true)}
                  >
                    ↓ Show {events.length - 4} more events
                  </button>
                )}
                {isMobile && showAllEvents && events.length > 4 && (
                  <button
                    type="button"
                    className={styles.showLessEventsBtn}
                    onClick={() => setShowAllEvents(false)}
                  >
                    ↑ Show less
                  </button>
                )}
              </>
            ) : (
              <div className={styles.noEvents}>No events found for this day/category.</div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HACKATHON — Day 4 (25 hours)
      ══════════════════════════════════════ */}
      <section id="hackathon" className={styles.hackSection}>
        <div className="container">
          <div className={styles.hackGrid}>
            <div className={`${styles.hackLeft} reveal`}>
              <p className="section-label" style={{ '--sa': '#00FF88' }}>✦ Sathakathon 2026</p>
              <h2 className={styles.hackTitle}>
                <span style={{ color: '#00FF88' }}>SATHAK</span><br />
                <span style={{ color: '#fff' }}>A-THON<br />2026</span>
              </h2>
              <p className={styles.hackDesc}>
                25 hours. Real problems. Legendary solutions. Join 500+ coders, designers,
                and innovators in MSAJCE's national hackathon.
              </p>
              <HackathonRegisterBtn />
              <div className={styles.hackPrize}>₹1,00,000+</div>
              <p className={styles.hackPrizeLabel}>Total Prize Pool</p>
            </div>

            <div className={`${styles.hackRight} reveal`} style={{ transitionDelay: '0.15s' }}>
              <div className={styles.hackTerminal}>
                <div className={styles.termBar}>
                  <span className={styles.termDot} style={{ background: '#FF5F56' }}/>
                  <span className={styles.termDot} style={{ background: '#FFBD2E' }}/>
                  <span className={styles.termDot} style={{ background: '#27C93F' }}/>
                </div>
                {[
                  { pre: '$ ', text: 'sathakathon --init 2026', color: '#00FF88' },
                  { pre: '',   text: 'Loading hackathon environment...', color: 'rgba(255,255,255,0.3)' },
                  { pre: '✓ ', label: 'Duration:', val: '25 Hours' },
                  { pre: '✓ ', label: 'Teams:', val: '2–4 Members' },
                  { pre: '✓ ', label: 'Tracks:', val: 'AI · Web3 · HealthTech · GreenTech' },
                  { pre: '✓ ', label: 'Mentors:', val: 'Industry Leaders' },
                  { pre: '✓ ', label: 'Prize Pool:', val: '₹1,00,000+' },
                  { pre: '$ ', cursor: true },
                ].map((line, i) => (
                  <div key={i} className={styles.termLine}>
                    <span style={{ color: '#00F5FF' }}>{line.pre}</span>
                    {line.text && <span style={{ color: line.color || '#00FF88' }}>{line.text}</span>}
                    {line.label && <>
                      <span style={{ color: '#FFD700' }}>{line.label}</span>
                      <span style={{ color: '#fff' }}> {line.val}</span>
                    </>}
                    {line.cursor && <span className={styles.termCursor}/>}
                  </div>
                ))}
              </div>
              <div className={styles.hackStats}>
                {[['500+','Hackers'],['25','Hours'],['4','Tracks'],['50+','Mentors']].map(([n, l]) => (
                  <div key={l} className={styles.hackStat}>
                    <span className={styles.hackStatNum}>{n}</span>
                    <span className={styles.hackStatLbl}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRIZE SECTION
      ══════════════════════════════════════ */}
      <section className={styles.prizeSection}>
        <div className={styles.prizeBg} />
        <div className={`${styles.prizeContent} reveal`}>
          <p className={styles.prizeEyebrow}>✦ Grand Prize Pool</p>
          <div className={styles.prizeAmount}><span className={styles.prizeHighlight}>₹25,00,000 +</span></div>
          <p className={styles.prizeDesc}>
            Across 25+ events · 10 days of cash prizes, trophies, certificates , overall & internship opportunities
          </p>
          <button type="button" className={styles.prizeBtn} onClick={scrollToEvents} data-hover>
            Compete for It →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCHEDULE — timeline
      ══════════════════════════════════════ */}
      <section id="schedule" className={`section ${styles.scheduleSection}`}>
        <div className="container">
          <div className={`${styles.sectionHeader} reveal`}>
            <p className="section-label">✦ Schedule</p>
            <h2 className={styles.sectionTitle}>
              10 Days of<br /><span className="gradient-gold">Action</span>
            </h2>
            <p className={styles.sectionDesc}>
              April 6–17, 2026 · MSAJCE, Siruseri IT Park, Chennai
            </p>
          </div>

          <div className={styles.timeline}>
            {DAYS.map((day, di) => (
              <ScheduleDay key={day.id} day={day} di={di} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section id="about" className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutText} reveal`}>
              <p className="section-label">✦ About</p>
              <h2 className={styles.sectionTitle}>
                The Stage is Set.<br />
                <span className="gradient-gold">Are You Ready?</span>
              </h2>
              <p className={styles.aboutDesc}>
                Sathak Thiruvizha Fest is the flagship annual festival of Mohamed Sathak AJ College of Engineering.
                Every year, thousands of students from across Tamil Nadu gather for five days of competition,
                creativity, and celebration.
              </p>
              <p className={styles.aboutDesc}>
                The 2026 edition — our 25th Silver Jubilee — promises the grandest stage yet: 10 full days,
                bigger prize pools, more events, industry judges, and moments that follow you for life.
              </p>
              <div className={styles.aboutFeatures}>
                {[
                  { icon: '🏛️', text: 'MSAJCE, Siruseri IT Park, Chennai' },
                  { icon: '📅', text: 'April 6–17, 2026 · 10 Days' },
                  { icon: '🎓', text: 'Open to all college students' },
                  { icon: '🏆', text: 'Grand Finale — April 17, 2026' },
                ].map(f => (
                  <div key={f.text} className={styles.aboutFeatureItem}>
                    <span className={styles.aboutFeatureIcon}>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-primary" onClick={scrollToEvents} data-hover>
                <span>Register for Sathak Thiruvizha Fest 2026</span>
              </button>
            </div>

            <div className={`${styles.aboutVisual} reveal`} style={{ transitionDelay: '0.2s' }}>
              <div className={styles.aboutCard}>
                <div className={styles.aboutCardGlow} />
                <p className={styles.aboutCardEyebrow}>Organised by</p>
                <h3 className={styles.aboutCardName}>Mohamed Sathak<br />AJ College of Engineering</h3>
                <div className={styles.aboutCardDivider} />
                <p className={styles.aboutCardLocation}>📍 Siruseri IT Park, Chennai — 603103</p>
                <div className={styles.aboutCardStats}>
                  <div><p className={styles.aboutStatNum}>2026</p><p className={styles.aboutStatLbl}>Edition</p></div>
                  <div><p className={styles.aboutStatNum}>10</p><p className={styles.aboutStatLbl}>Days</p></div>
                  <div><p className={styles.aboutStatNum}>25+</p><p className={styles.aboutStatLbl}>Events</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>✦ SATHAK THIRUVIZHA</div>
              <p className={styles.footerYear}>2026</p>
              <p className={styles.footerTagline}>{CONFIG.TAGLINE}</p>
              <p className={styles.footerCollege}>Mohamed Sathak AJ College of Engineering<br />Siruseri IT Park, Chennai — 603103</p>
            </div>

            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Navigate</p>
              <div className={styles.footerLinks}>
                <a href="#home" onClick={e => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) }}>Home</a>
                <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }}>Events</a>
                <a href="#schedule" onClick={e => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }) }}>Schedule</a>
                <a href="#about" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}>About</a>
              </div>
            </div>

            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Events</p>
              <div className={styles.footerLinks}>
                <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }}>Technical</a>
                <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }}>Cultural</a>
                <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }}>Special</a>
                <a href="#events" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }}>Hackathon</a>
              </div>
            </div>

            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Contact</p>
              <div className={styles.footerContact}>
                <a href="mailto:habibifest2026@msajce.edu.in" className={styles.footerContactItem}>
                  <span>✉</span><span>habibifest2026@msajce.edu.in</span>
                </a>
                <a href="tel:+919876543210" className={styles.footerContactItem}>
                  <span>📞</span><span>+91 98765 43210</span>
                </a>
              </div>
            </div>
          </div>

          <div className={styles.footerDivider} />

          <div className={styles.footerBottom}>
            <p>© 2026 Sathak Thiruvizha Fest · MSAJCE Chennai. All rights reserved.</p>
            <p className={styles.footerBuilt}>
              Crafted by the Fest Committee ·{' '}
              <a href="/admin" className={styles.footerAdminLink}>Admin</a>
            </p>
          </div>

          {/* Developer Card */}
          <div className={styles.devCard}>
            <img src={rasithProfile} alt="Mohamed Rasith" className={styles.devCardAvatar} />
            <div className={styles.devCardInfo}>
              <p className={styles.devCardName}>Mohamed Rasith</p>
              <div className={styles.devCardLinks}>
                <a href="mailto:mohamedrasith134@gmail.com" className={styles.devCardLink} title="Email">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/mohamed-rasith-6421542a6/" target="_blank" rel="noreferrer" className={styles.devCardLink} title="LinkedIn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://exam.aasaantech.com/developer" target="_blank" rel="noreferrer" className={styles.devCardLink} title="Portfolio">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </a>
              </div>
            </div>
            <p className={styles.devCardQuote}>" I tried my best "</p>
          </div>
        </div>
      </footer>
    </>
  )
}

// ── Hackathon register button — fetches link from backend ─────
function HackathonRegisterBtn() {
  const [link, setLink] = useState('')

  useEffect(() => {
    getEvents({ day: 'day4', category: 'hackathon' })
      .then(evts => {
        const hack = evts.find(e => e.isHackathon)
        if (hack?.hackathonLink) setLink(hack.hackathonLink)
      })
      .catch(() => {})
  }, [])

  const handle = () => {
    window.open('https://sathakathon.msajce-edu.in/', '_blank', 'noreferrer')
  }

  return (
    <button type="button" className={styles.hackBtn} onClick={handle} data-hover>
      Register at Sathakathon →
    </button>
  )
}

// ── Schedule Day row — shows DB events only if admin has added them ──
function ScheduleDay({ day, di }) {
  const [dayEvents, setDayEvents] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getEvents({ day: day.id })
      .then(data => { setDayEvents(data); setLoaded(true) })
      .catch(() => { setDayEvents([]); setLoaded(true) })
  }, [day.id])

  return (
    <div className={`${styles.timelineDay} reveal`} style={{ transitionDelay: `${di * 0.08}s` }}>
      <div className={styles.timelineDot} style={{ background: day.accent, boxShadow: `0 0 24px ${day.accent}88` }} />
      <div className={styles.timelineCard} style={{ '--d-color': day.accent }}>
        <div className={styles.timelineCardHeader}>
          <div>
            <p className={styles.timelineDate}>{day.fullDate || `${day.date}, 2026`}</p>
            <h3 className={styles.timelineTitle}>{day.icon} {day.theme}</h3>
          </div>
          <span className={styles.timelineDayBadge} style={{ color: day.accent, borderColor: day.accent + '44' }}>
            {day.label}
          </span>
        </div>
        <div className={styles.timelineEvents}>
          {!loaded ? (
            <div className={styles.timelineEmpty}>Loading…</div>
          ) : dayEvents.length > 0 ? dayEvents.map(ev => (
            <div key={ev._id} className={styles.timelineEvent}>
              <span className={styles.timelineEvtIcon}>{ev.icon || '✦'}</span>
              <div className={styles.timelineEvtInfo}>
                <p className={styles.timelineEvtName}>{ev.name}</p>
                <p className={styles.timelineEvtMeta}>
                  {ev.time || ev.duration} · {ev.teamSize}
                  {ev.entryFee ? ` · ₹${ev.entryFee}` : ' · Free'}
                </p>
              </div>
              <button
                type="button"
                className={styles.timelineRegBtn}
                onClick={() => {
                  const link = ev.isHackathon ? ev.hackathonLink : ev.googleFormLink
                  if (link) window.open(link, '_blank', 'noreferrer')
                  else document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{ '--btn-accent': day.accent }}
              >
                Register →
              </button>
            </div>
          )) : (
            <div className={styles.timelineEmpty}>
              Events will be announced soon · {day.fullDate}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Intro overlay ──────────────────────────────────────────────
function IntroOverlay({ onDone }) {
  const [phase, setPhase] = useState(0)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.body.style.overflow = 'hidden'
    document.body.classList.add('intro-playing')
    sessionStorage.removeItem('hbl-from-landing')
    sessionStorage.setItem('hbl-intro-shown', '1')

    const t1 = setTimeout(() => setPhase(1), 2600)
    const t2 = setTimeout(() => {
      document.body.style.overflow = ''
      document.body.classList.remove('intro-playing')
      onDoneRef.current?.()
    }, 3400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
      document.body.classList.remove('intro-playing')
    }
  }, [])

  return (
    <div className={`${styles.intro} ${phase === 1 ? styles.introExit : ''}`}>
      <div className={styles.introInner}>
        <p className={styles.introCollege}>Mohamed Sathak AJ College of Engineering</p>
        <div className={styles.introLine} />
        <h1 className={styles.introTitle}>SATHAK<br />THIRUVIZHA</h1>
        <div className={styles.introMeta}>
          <span>2026</span>
          <span className={styles.introMetaSep}>·</span>
          <span>Chennai</span>
          <span className={styles.introMetaSep}>·</span>
          <span>April 6–17</span>
        </div>
      </div>
    </div>
  )
}
