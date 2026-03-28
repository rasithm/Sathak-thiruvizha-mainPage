import { useEffect, useRef } from 'react'

export default function LaserBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function hexRgb(hex) {
      return {
        r: parseInt(hex.slice(1,3),16),
        g: parseInt(hex.slice(3,5),16),
        b: parseInt(hex.slice(5,7),16),
      }
    }

    // ── Fixtures — more beams, faster movement ─────────────
    const FIXTURES = [
      {
        x: 0.05, color: '#00E5FF', rgb: hexRgb('#00E5FF'),
        pan:  { center: 0.18, range: 0.32, freq: 0.38, phase: 0.0 },
        tilt: { center: 0.72, range: 0.20, freq: 0.27, phase: 1.1 },
        spread: 0.048, intensity: 0.85, flicker: 0.08,
      },
      {
        x: 0.20, color: '#FFD700', rgb: hexRgb('#FFD700'),
        pan:  { center: 0.30, range: 0.28, freq: 0.44, phase: 1.8 },
        tilt: { center: 0.70, range: 0.18, freq: 0.31, phase: 2.4 },
        spread: 0.044, intensity: 0.80, flicker: 0.09,
      },
      {
        x: 0.35, color: '#FF3CAC', rgb: hexRgb('#FF3CAC'),
        pan:  { center: 0.45, range: 0.35, freq: 0.52, phase: 3.1 },
        tilt: { center: 0.68, range: 0.22, freq: 0.36, phase: 0.6 },
        spread: 0.046, intensity: 0.78, flicker: 0.10,
      },
      {
        x: 0.50, color: '#7C5CFC', rgb: hexRgb('#7C5CFC'),
        pan:  { center: 0.50, range: 0.40, freq: 0.48, phase: 0.9 },
        tilt: { center: 0.65, range: 0.25, freq: 0.33, phase: 3.7 },
        spread: 0.050, intensity: 0.82, flicker: 0.07,
      },
      {
        x: 0.65, color: '#00FF88', rgb: hexRgb('#00FF88'),
        pan:  { center: 0.55, range: 0.33, freq: 0.41, phase: 2.0 },
        tilt: { center: 0.70, range: 0.20, freq: 0.28, phase: 1.4 },
        spread: 0.046, intensity: 0.78, flicker: 0.09,
      },
      {
        x: 0.80, color: '#FFD700', rgb: hexRgb('#FFD700'),
        pan:  { center: 0.68, range: 0.28, freq: 0.46, phase: 2.6 },
        tilt: { center: 0.71, range: 0.18, freq: 0.30, phase: 0.3 },
        spread: 0.044, intensity: 0.80, flicker: 0.08,
      },
      {
        x: 0.95, color: '#00E5FF', rgb: hexRgb('#00E5FF'),
        pan:  { center: 0.82, range: 0.30, freq: 0.42, phase: 1.5 },
        tilt: { center: 0.72, range: 0.22, freq: 0.29, phase: 2.9 },
        spread: 0.048, intensity: 0.85, flicker: 0.08,
      },
    ]

    // ── Strobe flash state ────────────────────────────────
    let strobeAlpha = 0
    let nextStrobe  = 4 + Math.random() * 6

    // ── Stars ─────────────────────────────────────────────
    const STARS = Array.from({ length: 200 }, () => ({
      x:       Math.random(),
      y:       Math.random() * 0.75,
      r:       Math.random() * 1.3 + 0.2,
      alpha:   Math.random() * 0.55 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      speed:   Math.random() * 3 + 1.5,
    }))

    // ── Smoke particles ───────────────────────────────────
    const SMOKE = Array.from({ length: 80 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      size:  Math.random() * 90 + 30,
      speed: Math.random() * 0.00010 + 0.00004,
      drift: (Math.random() - 0.5) * 0.00007,
      alpha: Math.random() * 0.045 + 0.010,
      phase: Math.random() * Math.PI * 2,
    }))

    // ── Beat pulse (simulated BPM ~128) ───────────────────
    function getBeat(t) {
      const bpm    = 128
      const period = 60 / bpm
      const phase  = (t % period) / period
      // Sharp attack, slow decay
      return phase < 0.08 ? 1.0 : Math.max(0, 1 - (phase - 0.08) / 0.3)
    }

    function getTarget(f, t, W, H) {
      // Add a secondary fast oscillation on top of slow sweep = snapping movement
      const fastX = Math.sin(t * f.pan.freq  * Math.PI * 2 + f.pan.phase)
      const fastY = Math.sin(t * f.tilt.freq * Math.PI * 2 + f.tilt.phase)
      const snapX = Math.sin(t * f.pan.freq  * Math.PI * 6 + f.pan.phase * 1.3) * 0.08
      const snapY = Math.sin(t * f.tilt.freq * Math.PI * 5 + f.tilt.phase * 1.7) * 0.05

      const px = f.pan.center  + (fastX + snapX) * f.pan.range
      const py = f.tilt.center + (fastY + snapY) * f.tilt.range

      return {
        tx: Math.max(0.02, Math.min(0.98, px)) * W,
        ty: Math.max(0.55, Math.min(0.98, py)) * H,
      }
    }

    function drawStars(t, W, H) {
      STARS.forEach(s => {
        const pulse = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle))
        ctx.save()
        ctx.globalAlpha = pulse
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    function drawCone(f, t, W, H, beat) {
      const ox = f.x * W
      const oy = -6

      const { tx, ty } = getTarget(f, t, W, H)

      const dx  = tx - ox
      const dy  = ty - oy
      const len = Math.sqrt(dx*dx + dy*dy)
      const nx  = -dy / len
      const ny  =  dx / len

      const spreadAtFloor = f.spread * W

      // Flicker: faster & more dramatic
      const flicker   = 1 - f.flicker + f.flicker * Math.sin(t * 120 + f.x * 200)
      const beatBoost = 1 + beat * 0.35
      const intensity = f.intensity * flicker * beatBoost

      const { r, g, b } = f.rgb

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Outer glow cone
      const glowGrad = ctx.createLinearGradient(ox, oy, tx, ty)
      glowGrad.addColorStop(0,    `rgba(${r},${g},${b},${0.32 * intensity})`)
      glowGrad.addColorStop(0.25, `rgba(${r},${g},${b},${0.16 * intensity})`)
      glowGrad.addColorStop(0.7,  `rgba(${r},${g},${b},${0.06 * intensity})`)
      glowGrad.addColorStop(1,    `rgba(${r},${g},${b},0)`)

      ctx.beginPath()
      ctx.moveTo(ox - nx * 3, oy)
      ctx.lineTo(ox + nx * 3, oy)
      ctx.lineTo(tx + nx * spreadAtFloor * 1.6, ty)
      ctx.lineTo(tx - nx * spreadAtFloor * 1.6, ty)
      ctx.closePath()
      ctx.fillStyle = glowGrad
      ctx.fill()

      // Core beam
      const coreGrad = ctx.createLinearGradient(ox, oy, tx, ty)
      coreGrad.addColorStop(0,    `rgba(${r},${g},${b},${0.70 * intensity})`)
      coreGrad.addColorStop(0.12, `rgba(${r},${g},${b},${0.28 * intensity})`)
      coreGrad.addColorStop(0.5,  `rgba(${r},${g},${b},${0.10 * intensity})`)
      coreGrad.addColorStop(1,    `rgba(${r},${g},${b},0)`)

      ctx.beginPath()
      ctx.moveTo(ox - nx * 1.5, oy)
      ctx.lineTo(ox + nx * 1.5, oy)
      ctx.lineTo(tx + nx * spreadAtFloor * 0.38, ty)
      ctx.lineTo(tx - nx * spreadAtFloor * 0.38, ty)
      ctx.closePath()
      ctx.fillStyle = coreGrad
      ctx.fill()

      ctx.restore()

      // Floor hotspot
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const rx = spreadAtFloor * 0.9
      const ry = spreadAtFloor * 0.20
      const hGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, rx)
      hGrad.addColorStop(0,    `rgba(${r},${g},${b},${0.50 * intensity})`)
      hGrad.addColorStop(0.3,  `rgba(${r},${g},${b},${0.20 * intensity})`)
      hGrad.addColorStop(1,    `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.save()
      ctx.translate(tx, ty)
      ctx.scale(1, ry / rx)
      ctx.arc(0, 0, rx, 0, Math.PI * 2)
      ctx.restore()
      ctx.fillStyle = hGrad
      ctx.fill()
      ctx.restore()

      // Source glow
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const sGrad = ctx.createRadialGradient(ox, 8, 0, ox, 8, 20)
      sGrad.addColorStop(0,   `rgba(255,255,255,${0.75 * intensity})`)
      sGrad.addColorStop(0.3, `rgba(${r},${g},${b},${0.45 * intensity})`)
      sGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`)
      ctx.beginPath()
      ctx.arc(ox, 8, 20, 0, Math.PI * 2)
      ctx.fillStyle = sGrad
      ctx.fill()
      ctx.restore()
    }

    function drawSmoke(t, W, H) {
      SMOKE.forEach(p => {
        p.y -= p.speed
        p.x += p.drift + Math.sin(t * 0.3 + p.phase) * 0.00004
        if (p.y < -0.1)             { p.y = 1.05; p.x = Math.random() }
        if (p.x < -0.05 || p.x > 1.05) p.drift *= -1

        const density = p.alpha * (0.35 + 0.65 * (p.y > 0.65 ? 1 : p.y / 0.65))
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const sg = ctx.createRadialGradient(p.x*W, p.y*H, 0, p.x*W, p.y*H, p.size)
        sg.addColorStop(0,   `rgba(160,165,195,${density})`)
        sg.addColorStop(0.5, `rgba(120,125,160,${density * 0.35})`)
        sg.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = sg
        ctx.beginPath()
        ctx.arc(p.x*W, p.y*H, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    function drawStrobe(t, W, H) {
      if (t >= nextStrobe) {
        strobeAlpha = 0.18
        nextStrobe  = t + 3 + Math.random() * 8
      }
      if (strobeAlpha > 0) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = `rgba(255,255,255,${strobeAlpha})`
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
        strobeAlpha *= 0.72 // fast decay
      }
    }

    function drawAmbientGlow(beat, W, H) {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Center ambient pulses with beat
      const pulse = 0.12 + beat * 0.10
      const center = ctx.createRadialGradient(W*0.5, H*0.45, 0, W*0.5, H*0.45, W*0.55)
      center.addColorStop(0,   `rgba(25,35,90,${pulse})`)
      center.addColorStop(0.5, `rgba(10,15,55,${pulse * 0.5})`)
      center.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = center
      ctx.fillRect(0, 0, W, H)

      // Floor warm strip
      const floor = ctx.createLinearGradient(0, H*0.88, 0, H)
      floor.addColorStop(0,   'rgba(255,160,20,0)')
      floor.addColorStop(0.5, `rgba(255,140,10,${0.06 + beat * 0.05})`)
      floor.addColorStop(1,   'rgba(255,120,0,0.03)')
      ctx.fillStyle = floor
      ctx.fillRect(0, H*0.88, W, H*0.12)

      ctx.restore()
    }

    function drawVignette(W, H) {
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      const grad = ctx.createRadialGradient(W/2, H*0.42, H*0.08, W/2, H*0.42, H * 0.92)
      grad.addColorStop(0,    'rgba(0,0,0,0)')
      grad.addColorStop(0.5,  'rgba(0,0,0,0.18)')
      grad.addColorStop(1,    'rgba(0,0,0,0.90)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      ctx.restore()
    }

    function render(ts) {
      const t    = ts * 0.001
      const W    = canvas.width
      const H    = canvas.height
      const beat = getBeat(t)

      ctx.fillStyle = '#05050D'
      ctx.fillRect(0, 0, W, H)

      drawStars(t, W, H)
      drawAmbientGlow(beat, W, H)
      drawSmoke(t, W, H)
      FIXTURES.forEach(f => drawCone(f, t, W, H, beat))
      drawStrobe(t, W, H)
      drawVignette(W, H)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="laser-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}