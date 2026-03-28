import express from 'express'
import Event from '../models/Event.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// ─── PUBLIC ROUTES ────────────────────────────────────────────

// GET /api/events
// Optional query: ?day=day1&category=technical&active=true
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.day && req.query.day !== 'all') filter.day = req.query.day
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category

    const events = await Event.find(filter).sort({ day: 1, order: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/events/:slug  — single event detail
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── ADMIN ROUTES (require JWT) ───────────────────────────────

// GET /api/events/admin/all — all events including inactive
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const filter = {}
    if (req.query.day && req.query.day !== 'all') filter.day = req.query.day
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category
    if (req.query.active === 'true') filter.isActive = true
    if (req.query.active === 'false') filter.isActive = false

    const events = await Event.find(filter).sort({ day: 1, order: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/events — create new event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const event = new Event(req.body)
    await event.save()
    res.status(201).json(event)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/events/:id — update event (all fields optional)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/events/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/events/seed — seed initial events from config (admin only)
router.post('/seed/init', authMiddleware, async (req, res) => {
  try {
    const { events } = req.body
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'events array required in body' })
    }
    // Upsert each event by slug
    const results = []
    for (const ev of events) {
      const doc = await Event.findOneAndUpdate(
        { slug: ev.slug },
        { $set: ev },
        { upsert: true, new: true, runValidators: true }
      )
      results.push(doc)
    }
    res.json({ inserted: results.length, events: results })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
