import { useEffect, useRef, useState } from 'react'

const EVENT_DATES = ['2026-03-15', '2026-03-16', '2026-03-17']

async function getSunTimes() {
  try {
    const res = await fetch('https://api.sunrise-sunset.org/json?lat=13.0827&lng=80.2707&formatted=0')
    const data = await res.json()
    return {
      sunrise: new Date(data.results.sunrise),
      sunset: new Date(data.results.sunset),
    }
  } catch { return null }
}

function detectMode(sun) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  if (EVENT_DATES.includes(today)) return 'festival'
  if (!sun) {
    const h = now.getHours()
    return h >= 6 && h < 19 ? 'day' : 'night'
  }
  return (now >= sun.sunrise && now <= sun.sunset) ? 'night' : 'night'
}

// ── String Lights ────────────────────────────────────────────
function StringLights({ visible }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3,
      height: 80, pointerEvents: 'none',
      opacity: visible ? 1 : 0, transition: 'opacity 2s ease',
    }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="bulbGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M0,10 Q180,38 360,10 Q540,38 720,10 Q900,38 1080,10 Q1260,38 1440,10"
          stroke="rgba(80,60,20,0.55)" strokeWidth="1.5" fill="none" />
        {[
          [90, 28, '#FFD700'], [180, 37, '#FF4400'], [270, 28, '#00F5FF'],
          [360, 10, '#FFD700'], [450, 28, '#BF00FF'], [540, 37, '#00FF88'],
          [630, 28, '#FF6B35'], [720, 10, '#FFD700'], [810, 28, '#FF4400'],
          [900, 37, '#00F5FF'], [990, 28, '#BF00FF'], [1080, 10, '#FFD700'],
          [1170, 28, '#00FF88'], [1260, 37, '#FF6B35'], [1350, 28, '#FFD700'],
        ].map(([cx, cy, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill={fill}
            filter="url(#bulbGlow)" opacity={0.92}
            style={{ animation: `bulbFlicker ${1.8 + i * 0.3}s ease-in-out ${i * 0.15}s infinite alternate` }}
          />
        ))}
      </svg>
    </div>
  )
}

// ── Ground Scene ─────────────────────────────────────────────
function GroundScene({ mode }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 2, pointerEvents: 'none', height: '38vh',
    }}>
      <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
          </linearGradient>
          <filter id="svgGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x="380" y="155" width="680" height="145" rx="4" fill="rgba(20,10,5,0.92)" />
        <rect x="380" y="148" width="680" height="14" rx="2" fill="rgba(90,45,0,0.85)" />
        <rect x="400" y="90" width="22" height="175" rx="2" fill="rgba(35,18,5,0.9)" />
        <rect x="1018" y="90" width="22" height="175" rx="2" fill="rgba(35,18,5,0.9)" />
        <rect x="422" y="98" width="596" height="58" rx="3" fill="rgba(4,4,28,0.96)" />
        <text x="720" y="136" fontFamily="'Orbitron',sans-serif" fontSize="17"
          fill="rgba(255,215,0,0.8)" textAnchor="middle" letterSpacing="3">
          HABIBI FEST 2026
        </text>
        <rect x="412" y="90" width="616" height="10" rx="2" fill="rgba(55,32,8,0.92)" />
        {[
          [455, 95, '#FFD700'], [530, 95, '#00F5FF'], [720, 95, '#ffffff'],
          [910, 95, '#FF6B35'], [985, 95, '#BF00FF'],
        ].map(([cx, cy, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={mode === 'day' ? 5 : 7}
            fill={fill} filter="url(#svgGlow)"
            style={{ animation: `spotFlicker ${0.6 + i * 0.25}s ease-in-out ${i * 0.18}s infinite alternate` }}
            opacity={mode === 'day' ? 0.6 : 0.95}
          />
        ))}
        <path d="M280,300 Q335,175 385,162" stroke="rgba(255,215,0,0.35)" strokeWidth="2.5" fill="none" />
        <path d="M1160,300 Q1105,175 1055,162" stroke="rgba(255,215,0,0.35)" strokeWidth="2.5" fill="none" />
        <rect x="45" y="195" width="130" height="105" rx="3" fill="rgba(100,30,0,0.72)" />
        <rect x="45" y="189" width="130" height="14" rx="2" fill="rgba(220,80,0,0.75)" />
        <text x="110" y="252" fontFamily="sans-serif" fontSize="11" fill="rgba(255,210,120,0.75)" textAnchor="middle">FOOD COURT</text>
        <rect x="1265" y="195" width="130" height="105" rx="3" fill="rgba(0,25,80,0.72)" />
        <rect x="1265" y="189" width="130" height="14" rx="2" fill="rgba(0,90,200,0.65)" />
        <text x="1330" y="252" fontFamily="sans-serif" fontSize="11" fill="rgba(120,190,255,0.75)" textAnchor="middle">TECH EXPO</text>
        <path d="M0,300 L0,255 Q18,244 28,252 Q40,260 52,246 Q64,232 78,244 Q92,256 108,238 Q124,220 140,234 Q156,248 172,232 Q188,216 204,230 Q220,244 240,226 Q260,208 280,224 Q300,240 320,222 Q340,204 360,220 Q380,236 400,218 Q420,200 440,165 L1000,165 Q1020,200 1040,218 Q1060,236 1080,220 Q1100,204 1120,222 Q1140,240 1160,224 Q1180,208 1200,226 Q1220,244 1240,230 Q1260,216 1280,232 Q1300,248 1316,234 Q1332,220 1348,238 Q1364,256 1380,244 Q1396,232 1408,246 Q1420,260 1432,252 Q1438,248 1440,255 L1440,300 Z"
          fill="rgba(0,0,0,0.82)" />
        <rect x="0" y="0" width="1440" height="300" fill="url(#groundGrad)" />
      </svg>
    </div>
  )
}

// ── Mode Badge ───────────────────────────────────────────────
function ModeBadge({ mode }) {
  const labels = { day: '☀️ Day Mode', night: '🌙 Night Mode', festival: '🎆 Festival Live!' }
  return (
    <div style={{
      position: 'fixed', top: 76, right: 20, zIndex: 500,
      fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700,
      letterSpacing: 3, padding: '6px 14px', borderRadius: 100,
      textTransform: 'uppercase', border: '1px solid', backdropFilter: 'blur(10px)',
      transition: 'all 1s',
      ...(mode === 'day' ? { color: '#ff9900', borderColor: 'rgba(255,153,0,0.4)', background: 'rgba(255,153,0,0.1)' } :
        mode === 'night' ? { color: '#00F5FF', borderColor: 'rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.06)' } :
          { color: '#ff4400', borderColor: 'rgba(255,68,0,0.4)', background: 'rgba(255,68,0,0.12)', animation: 'festPulse 0.8s ease-in-out infinite alternate' }),
    }}>
      {labels[mode]}
    </div>
  )
}

// ── Lanterns ─────────────────────────────────────────────────
function Lanterns({ visible }) {
  const cols = ['#FF6B35', '#FFD700', '#FF006E', '#BF00FF', '#00F5FF', '#00FF88']
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '50%',
      zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
      opacity: visible ? 1 : 0, transition: 'opacity 2s',
    }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${5 + i * 8}%`,
          bottom: `${18 + Math.sin(i * 1.7) * 20}%`,
          width: 18, height: 28,
          background: cols[i % cols.length],
          borderRadius: '4px 4px 8px 8px',
          boxShadow: `0 0 18px ${cols[i % cols.length]}`,
          opacity: 0.88,
          animation: `lanternFloat ${2.5 + (i % 3) * 0.7}s ease-in-out ${i * 0.2}s infinite alternate`,
        }} />
      ))}
    </div>
  )
}

// ── Confetti ─────────────────────────────────────────────────
function Confetti({ visible }) {
  const cols = ['#FFD700', '#FF006E', '#00F5FF', '#BF00FF', '#00FF88', '#FF6B35', '#fff']
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 70 }, (_, i) => {
        const s = 6 + Math.random() * 8
        return (
          <div key={i} style={{
            position: 'absolute', top: -20,
            left: `${Math.random() * 100}%`,
            width: s, height: s * 1.6,
            background: cols[i % cols.length],
            borderRadius: 2,
            opacity: 0.7 + Math.random() * 0.3,
            animation: `confettiFall ${3 + Math.random() * 5}s linear ${Math.random() * 3}s infinite`,
          }} />
        )
      })}
    </div>
  )
}

// ── Main Environment ─────────────────────────────────────────
export default function Environment() {
  const skyRef = useRef(null)   // sky canvas (day/night bg)
  const laserRef = useRef(null)   // laser canvas (stage lights)
  const audioRef = useRef(null)
  const modeRef = useRef('night')
  const [mode, setMode] = useState('night')
  const starsRef = useRef([])
  const fwRef = useRef([])
  const skyAnimRef = useRef(null)
  const laserAnimRef = useRef(null)
  const celestialRef = useRef(0)

  // ── Fixtures for laser canvas ──────────────────────────────
  function buildFixtures() {
    function hexRgb(hex) {
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
      }
    }
    return [
      {
        x: 0.05, rgb: hexRgb('#00E5FF'),
        pan: { center: 0.18, range: 0.28, freq: 0.14, phase: 0.0 },
        tilt: { center: 0.72, range: 0.16, freq: 0.10, phase: 1.1 },
        spread: 0.048, intensity: 0.85, flicker: 0.03
      },
      {
        x: 0.20, rgb: hexRgb('#FFD700'),
        pan: { center: 0.30, range: 0.24, freq: 0.16, phase: 1.8 },
        tilt: { center: 0.70, range: 0.14, freq: 0.11, phase: 2.4 },
        spread: 0.044, intensity: 0.80, flicker: 0.03
      },
      {
        x: 0.35, rgb: hexRgb('#FF3CAC'),
        pan: { center: 0.45, range: 0.30, freq: 0.18, phase: 3.1 },
        tilt: { center: 0.68, range: 0.18, freq: 0.12, phase: 0.6 },
        spread: 0.046, intensity: 0.78, flicker: 0.03
      },
      {
        x: 0.50, rgb: hexRgb('#7C5CFC'),
        pan: { center: 0.50, range: 0.35, freq: 0.15, phase: 0.9 },
        tilt: { center: 0.65, range: 0.20, freq: 0.11, phase: 3.7 },
        spread: 0.050, intensity: 0.82, flicker: 0.02
      },
      {
        x: 0.65, rgb: hexRgb('#00FF88'),
        pan: { center: 0.55, range: 0.28, freq: 0.17, phase: 2.0 },
        tilt: { center: 0.70, range: 0.16, freq: 0.10, phase: 1.4 },
        spread: 0.046, intensity: 0.78, flicker: 0.03
      },
      {
        x: 0.80, rgb: hexRgb('#FFD700'),
        pan: { center: 0.68, range: 0.24, freq: 0.16, phase: 2.6 },
        tilt: { center: 0.71, range: 0.14, freq: 0.11, phase: 0.3 },
        spread: 0.044, intensity: 0.80, flicker: 0.03
      },
      {
        x: 0.95, rgb: hexRgb('#00E5FF'),
        pan: { center: 0.82, range: 0.26, freq: 0.15, phase: 1.5 },
        tilt: { center: 0.72, range: 0.18, freq: 0.10, phase: 2.9 },
        spread: 0.048, intensity: 0.85, flicker: 0.03
      },
    ]
  }

  // ── Sound ──────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current = new Audio('/fireworks.mp3')
    audioRef.current.volume = 0.35
    const unlock = () => {
      audioRef.current.play().then(() => audioRef.current.pause()).catch(() => { })
    }
    document.addEventListener('click', unlock, { once: true })
    return () => document.removeEventListener('click', unlock)
  }, [])

  function playFirework() {
    if (!audioRef.current || !audioRef.current.paused) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => { })
  }

  // ── SKY CANVAS ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = skyRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let W, H
    let resizeTimer

    function resize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth
        H = canvas.height = window.innerHeight
        starsRef.current = Array.from({ length: 160 }, () => ({
          x: Math.random() * W, y: Math.random() * H * 0.7,
          r: Math.random() * 1.5 + 0.3, a: Math.random(),
          da: Math.random() * 0.01 + 0.003,
        }))
      }, 100)
    }
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
    starsRef.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.7,
      r: Math.random() * 1.5 + 0.3, a: Math.random(),
      da: Math.random() * 0.01 + 0.003,
    }))
    window.addEventListener('resize', resize, { passive: true })

    getSunTimes().then(sun => {
      const m = detectMode(sun)
      modeRef.current = m
      setMode(m)
      document.body.setAttribute('data-mode', m)
    })

    const modeInterval = setInterval(async () => {
      const sun = await getSunTimes()
      const m = detectMode(sun)
      if (m !== modeRef.current) {
        modeRef.current = m
        setMode(m)
        document.body.setAttribute('data-mode', m)
      }
    }, 300_000)

    function drawDay() {
      const grd = ctx.createLinearGradient(0, 0, 0, H * 0.82)
      grd.addColorStop(0, '#1a6fc4')
      grd.addColorStop(0.4, '#3a9dd9')
      grd.addColorStop(0.75, '#f7c97e')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H * 0.82)
      drawSun()
      drawClouds()
    }

    function drawNight() {
      const grd = ctx.createLinearGradient(0, 0, 0, H * 0.82)
      grd.addColorStop(0, '#020615')
      grd.addColorStop(0.5, '#060d2a')
      grd.addColorStop(0.75, '#0d0530')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H * 0.82)
      drawStarField()
      drawMoon()
    }

    function drawFestival() {
      const grd = ctx.createLinearGradient(0, 0, 0, H * 0.82)
      grd.addColorStop(0, '#1a0030')
      grd.addColorStop(0.4, '#2d0050')
      grd.addColorStop(0.7, '#3d0a00')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H * 0.82)
      drawStarField()
      drawFireworks()
    }

    function drawSun() {
      celestialRef.current += 0.0001
      const t = (Math.sin(celestialRef.current) + 1) / 2
      const sx = W * 0.2 + W * 0.6 * t
      const sy = H * 0.08 + H * 0.06 * (1 - Math.abs(t - 0.5) * 2)
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 130)
      glow.addColorStop(0, 'rgba(255,240,100,0.7)')
      glow.addColorStop(0.2, 'rgba(255,200,60,0.4)')
      glow.addColorStop(0.5, 'rgba(255,150,30,0.12)')
      glow.addColorStop(1, 'rgba(255,100,0,0)')
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(sx, sy, 130, 0, Math.PI * 2); ctx.fill()
      const sunG = ctx.createRadialGradient(sx, sy, 0, sx, sy, 38)
      sunG.addColorStop(0, '#fffde0')
      sunG.addColorStop(0.5, '#ffd700')
      sunG.addColorStop(1, '#ff9900')
      ctx.fillStyle = sunG
      ctx.beginPath(); ctx.arc(sx, sy, 38, 0, Math.PI * 2); ctx.fill()
    }

    function drawMoon() {
      celestialRef.current += 0.0002
      const t = (Math.sin(celestialRef.current) + 1) / 2
      const mx = W * 0.2 + W * 0.3 * t
      const my = H * 0.07 + H * 0.05 * (1 - Math.abs(t - 0.5) * 2)
      const moonGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 85)
      moonGlow.addColorStop(0, 'rgba(200,220,255,0.22)')
      moonGlow.addColorStop(0.5, 'rgba(150,170,220,0.1)')
      moonGlow.addColorStop(1, 'rgba(100,120,200,0)')
      ctx.fillStyle = moonGlow
      ctx.beginPath(); ctx.arc(mx, my, 85, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(220,230,255,0.96)'
      ctx.beginPath(); ctx.arc(mx, my, 28, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(180,195,240,1)'
      ctx.beginPath(); ctx.arc(mx, my, 25, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(6,10,30,0.65)'
      ctx.beginPath(); ctx.arc(mx + 8, my - 4, 22, 0, Math.PI * 2); ctx.fill()
    }

    function drawStarField() {
      starsRef.current.forEach(s => {
        s.a += s.da
        if (s.a > 1 || s.a < 0) s.da *= -1
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.fill()
      })
    }

    function drawClouds() {
      const t = Date.now() / 26000
        ;[[0.15, 0.11, 200, 38], [0.45, 0.09, 155, 32], [0.72, 0.13, 185, 36], [0.3, 0.19, 125, 28]].forEach(([xf, yf, w, h]) => {
          const cx = ((xf + t * 0.02) % 1.3 - 0.1) * W
          const cy = yf * H
          ctx.fillStyle = 'rgba(255,255,255,0.55)'
            ;[0, -w * 0.3, w * 0.35].forEach((dx, j) => {
              ctx.beginPath()
              ctx.ellipse(cx + dx, cy + (j === 0 ? 0 : h * 0.18), w * (j === 0 ? 1 : 0.58), h * (j === 0 ? 1 : 0.65), 0, 0, Math.PI * 2)
              ctx.fill()
            })
        })
    }

    function drawFireworks() {
      if (Math.random() < 0.018) {
        if (Math.random() < 0.4) playFirework()
        fwRef.current.push({
          x: W * 0.15 + Math.random() * W * 0.7,
          y: H * 0.04 + Math.random() * H * 0.22,
          particles: Array.from({ length: 32 }, () => ({
            a: Math.random() * Math.PI * 2,
            v: 2 + Math.random() * 5,
            r: 1 + Math.random() * 2,
            life: 1,
            color: `hsl(${Math.floor(Math.random() * 360)},100%,70%)`,
          })),
        })
      }
      fwRef.current.forEach(fw => {
        fw.particles.forEach(p => {
          p.life -= 0.022
          ctx.globalAlpha = Math.max(0, p.life)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(
            fw.x + Math.cos(p.a) * p.v * (1 - p.life) * 32,
            fw.y + Math.sin(p.a) * p.v * (1 - p.life) * 32,
            p.r, 0, Math.PI * 2
          )
          ctx.fill()
        })
      })
      ctx.globalAlpha = 1
      fwRef.current = fwRef.current.filter(fw => fw.particles.some(p => p.life > 0))
    }

    function skyFrame() {
      ctx.clearRect(0, 0, W, H)
      const m = modeRef.current
      if (m === 'day') drawDay()
      else if (m === 'night') drawNight()
      else drawFestival()
      skyAnimRef.current = requestAnimationFrame(skyFrame)
    }
    skyFrame()

    return () => {
      cancelAnimationFrame(skyAnimRef.current)
      clearInterval(modeInterval)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── LASER CANVAS ───────────────────────────────────────────
  useEffect(() => {
    const canvas = laserRef.current
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false })
    const FIXTURES = buildFixtures()
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let strobeAlpha = 0
    let nextStrobe = 4 + Math.random() * 6

    // Reduced smoke particles for performance
    const SMOKE = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 90 + 30,
      speed: Math.random() * 0.00010 + 0.00004,
      drift: (Math.random() - 0.5) * 0.00007,
      alpha: Math.random() * 0.045 + 0.010,
      phase: Math.random() * Math.PI * 2,
    }))

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    function getBeat(t) {
      const period = 60 / 128
      const phase = (t % period) / period
      return phase < 0.08 ? 1.0 : Math.max(0, 1 - (phase - 0.08) / 0.3)
    }

    function getTarget(f, t) {
      const fastX = Math.sin(t * f.pan.freq * Math.PI * 2 + f.pan.phase)
      const fastY = Math.sin(t * f.tilt.freq * Math.PI * 2 + f.tilt.phase)
      const snapX = Math.sin(t * f.pan.freq * Math.PI * 2 + f.pan.phase * 1.3) * 0.05
      const snapY = Math.sin(t * f.tilt.freq * Math.PI * 1.5 + f.tilt.phase * 1.7) * 0.03
      return {
        tx: Math.max(0.02, Math.min(0.98, f.pan.center + (fastX + snapX) * f.pan.range)) * W,
        ty: Math.max(0.55, Math.min(0.98, f.tilt.center + (fastY + snapY) * f.tilt.range)) * H,
      }
    }

    function drawCone(f, t, beat) {
      const ox = f.x * W
      const oy = -6
      const { tx, ty } = getTarget(f, t)
      const dx = tx - ox, dy = ty - oy
      const len = Math.sqrt(dx * dx + dy * dy)
      const nx = -dy / len, ny = dx / len
      const spd = f.spread * W
      const flicker = 1 - f.flicker + f.flicker * Math.sin(t * 30 + f.x * 200)
      const intensity = f.intensity * flicker * (1 + beat * 0.35)
      const { r, g, b } = f.rgb

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Outer glow
      const glowGrad = ctx.createLinearGradient(ox, oy, tx, ty)
      glowGrad.addColorStop(0, `rgba(${r},${g},${b},${0.32 * intensity})`)
      glowGrad.addColorStop(0.25, `rgba(${r},${g},${b},${0.16 * intensity})`)
      glowGrad.addColorStop(0.7, `rgba(${r},${g},${b},${0.06 * intensity})`)
      glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.moveTo(ox - nx * 3, oy); ctx.lineTo(ox + nx * 3, oy)
      ctx.lineTo(tx + nx * spd * 1.6, ty); ctx.lineTo(tx - nx * spd * 1.6, ty)
      ctx.closePath()
      ctx.fillStyle = glowGrad; ctx.fill()

      // Core beam
      const coreGrad = ctx.createLinearGradient(ox, oy, tx, ty)
      coreGrad.addColorStop(0, `rgba(${r},${g},${b},${0.70 * intensity})`)
      coreGrad.addColorStop(0.12, `rgba(${r},${g},${b},${0.28 * intensity})`)
      coreGrad.addColorStop(0.5, `rgba(${r},${g},${b},${0.10 * intensity})`)
      coreGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.moveTo(ox - nx * 1.5, oy); ctx.lineTo(ox + nx * 1.5, oy)
      ctx.lineTo(tx + nx * spd * 0.38, ty); ctx.lineTo(tx - nx * spd * 0.38, ty)
      ctx.closePath()
      ctx.fillStyle = coreGrad; ctx.fill()
      ctx.restore()

      // Floor hotspot
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const rx = spd * 0.9, ry = spd * 0.20
      const hGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, rx)
      hGrad.addColorStop(0, `rgba(${r},${g},${b},${0.50 * intensity})`)
      hGrad.addColorStop(0.3, `rgba(${r},${g},${b},${0.20 * intensity})`)
      hGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.save(); ctx.translate(tx, ty); ctx.scale(1, ry / rx)
      ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.restore()
      ctx.fillStyle = hGrad; ctx.fill()
      ctx.restore()

      // Source glow
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const sGrad = ctx.createRadialGradient(ox, 8, 0, ox, 8, 20)
      sGrad.addColorStop(0, `rgba(255,255,255,${0.75 * intensity})`)
      sGrad.addColorStop(0.3, `rgba(${r},${g},${b},${0.45 * intensity})`)
      sGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath(); ctx.arc(ox, 8, 20, 0, Math.PI * 2)
      ctx.fillStyle = sGrad; ctx.fill()
      ctx.restore()
    }

    function drawSmoke(t) {
      SMOKE.forEach(p => {
        p.y -= p.speed
        p.x += p.drift + Math.sin(t * 0.3 + p.phase) * 0.00004
        if (p.y < -0.1) { p.y = 1.05; p.x = Math.random() }
        if (p.x < -0.05 || p.x > 1.05) p.drift *= -1
        const density = p.alpha * (0.35 + 0.65 * (p.y > 0.65 ? 1 : p.y / 0.65))
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const sg = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, p.size)
        sg.addColorStop(0, `rgba(160,165,195,${density})`)
        sg.addColorStop(0.5, `rgba(120,125,160,${density * 0.35})`)
        sg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = sg
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })
    }

    function drawStrobe(t) {
      if (t >= nextStrobe) {
        strobeAlpha = 0.18
        nextStrobe = t + 3 + Math.random() * 8
      }
      if (strobeAlpha > 0) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = `rgba(255,255,255,${strobeAlpha})`
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
        strobeAlpha *= 0.72
      }
    }

    function drawVignette() {
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      const grad = ctx.createRadialGradient(W / 2, H * 0.42, H * 0.08, W / 2, H * 0.42, H * 0.92)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(0.5, 'rgba(0,0,0,0.18)')
      grad.addColorStop(1, 'rgba(0,0,0,0.90)')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
      ctx.restore()
    }

    function laserFrame(ts) {
      const t = ts * 0.001
      const beat = getBeat(t)
      const m = modeRef.current

      ctx.clearRect(0, 0, W, H)

      // Only draw lasers in night or festival mode
      if (m === 'night' || m === 'festival') {
        drawSmoke(t)
        FIXTURES.forEach(f => drawCone(f, t, beat))
        drawStrobe(t)
        drawVignette()
      }

      laserAnimRef.current = requestAnimationFrame(laserFrame)
    }

    laserAnimRef.current = requestAnimationFrame(laserFrame)

    return () => {
      cancelAnimationFrame(laserAnimRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const nightOrFest = mode === 'night' || mode === 'festival'

  return (
    <>
      <style>{`
        @keyframes bulbFlicker  { from{opacity:0.5} to{opacity:1} }
        @keyframes spotFlicker  { from{opacity:0.4} to{opacity:1} }
        @keyframes lanternFloat { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(-20px) rotate(3deg)} }
        @keyframes confettiFall { to{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes festPulse    { to{box-shadow:0 0 22px rgba(255,68,0,0.5)} }
      `}</style>

      {/* Sky canvas — background */}
      <canvas ref={skyRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        willChange: 'transform',
      }} />

      {/* Laser canvas — on top of sky, behind UI */}
      <canvas ref={laserRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 1, pointerEvents: 'none',
        willChange: 'transform',
      }} />

      <Lanterns visible={nightOrFest} />
      <GroundScene mode={mode} />
      <StringLights visible={nightOrFest} />
      {mode === 'festival' && <Confetti visible />}
    </>
  )
}