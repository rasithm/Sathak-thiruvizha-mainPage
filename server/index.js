import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes   from './routes/auth.js'
import eventRoutes  from './routes/events.js'
import deptRoutes   from './routes/deptpoints.js'
import memberRoutes from './routes/members.js'
import siteStatsRoutes from './routes/sitestats.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 5000

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
]
// app.use(cors({
//   origin: (origin, cb) => {
//     // Allow requests with no origin (mobile apps, curl, etc.)
//     if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
//     cb(new Error('Not allowed by CORS'))
//   },
//   credentials: true
// }))
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }))

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/events',     eventRoutes)
app.use('/api/deptpoints', deptRoutes)
app.use('/api/members',    memberRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))
app.use('/api/sitestats', siteStatsRoutes)
// ── Serve React Frontend (production) ────────────────────────
// The built frontend lives at ../client/dist
const clientDist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))

// All non-API routes go to React (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

// ── Connect DB & Start ────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📦 Serving frontend from ${clientDist}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message)
    process.exit(1)
  })
