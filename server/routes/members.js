import express from 'express'
import EventMember from '../models/EventMember.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Helper: generate tagCode prefix from eventSlug
// e.g. "code-blitz" → "codeblitz", "overall" → "ovall"
function slugToPrefix(slug) {
  // Strip hyphens and spaces, lowercase, keep max 8 chars
  return slug.replace(/[-_\s]/g, '').toLowerCase().slice(0, 8)
}

// Helper: get next tagNo for an event
async function getNextTagNo(eventSlug) {
  const last = await EventMember.findOne({ eventSlug }).sort({ tagNo: -1 })
  return last ? last.tagNo + 1 : 1
}

// GET /api/members/by-event — public, grouped by eventSlug
router.get('/by-event', async (req, res) => {
  try {
    const members = await EventMember.find().sort({ tagNo: 1, createdAt: 1 })
    const map = {}
    members.forEach(m => {
      if (!map[m.eventSlug]) map[m.eventSlug] = { eventName: m.eventName, eventSlug: m.eventSlug, members: [] }
      map[m.eventSlug].members.push(m)
    })
    res.json(Object.values(map))
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/members — public, all members sorted tagNo → createdAt
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.eventSlug) filter.eventSlug = req.query.eventSlug
    const members = await EventMember.find(filter).sort({ tagNo: 1, createdAt: 1 })
    res.json(members)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/members/next-tag/:eventSlug — get next auto tagNo for an event (admin)
router.get('/next-tag/:eventSlug', authMiddleware, async (req, res) => {
  try {
    const { eventSlug } = req.params
    const tagNo = await getNextTagNo(eventSlug)
    const prefix = slugToPrefix(eventSlug)
    const tagCode = `${prefix}${String(tagNo).padStart(3, '0')}`
    res.json({ tagNo, tagCode })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/members — admin create (auto-assigns tagNo + tagCode)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { eventSlug, eventName, name, dept, year, role, regNo, photo, linkedin, email, phone, portfolio } = req.body
    if (!eventSlug || !eventName || !name || !dept || !year || !role)
      return res.status(400).json({ error: 'eventSlug, eventName, name, dept, year, role are required' })

    // Auto-assign tagNo
    const tagNo = await getNextTagNo(eventSlug)
    const prefix = slugToPrefix(eventSlug)
    const tagCode = `${prefix}${String(tagNo).padStart(3, '0')}`

    const m = new EventMember({
      eventSlug, eventName, tagNo, tagCode,
      regNo: regNo || '',
      name, dept, year, role,
      photo: photo || '',
      linkedin: linkedin || '',
      email: email || '',
      phone: phone || '',
      portfolio: portfolio || '',
    })
    await m.save()
    res.status(201).json(m)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/members/:id — admin update (does NOT reassign tagNo/tagCode unless explicitly changed)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Never auto-reassign tagNo on update
    const { tagNo, tagCode, ...rest } = req.body
    const m = await EventMember.findByIdAndUpdate(req.params.id, { $set: rest }, { new: true, runValidators: true })
    if (!m) return res.status(404).json({ error: 'Member not found' })
    res.json(m)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/members/:id — admin delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await EventMember.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
