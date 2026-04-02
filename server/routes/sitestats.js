import express from 'express'
import SiteStats from '../models/SiteStats.js'

const router = express.Router()

// ── Helper: get-or-create the single global doc ───────────────
async function getStats() {
  let doc = await SiteStats.findOne({ key: 'global' })
  if (!doc) doc = await SiteStats.create({ key: 'global' })
  return doc
}

// ── GET /api/sitestats
// Returns { visitCount, likeCount }
// Also increments visitCount on every call (each page load = 1 visit)
router.get('/', async (req, res) => {
  try {
    const doc = await SiteStats.findOneAndUpdate(
      { key: 'global' },
      { $inc: { visitCount: 1 }, $setOnInsert: { likeCount: 0 } },
      { new: true, upsert: true }
    )
    res.json({ visitCount: doc.visitCount, likeCount: doc.likeCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/sitestats/like
// Body: { action: 'add' | 'remove' }
// Increments or decrements likeCount. Frontend enforces 1 like per browser.
router.post('/like', async (req, res) => {
  try {
    const { action } = req.body  // 'add' or 'remove'
    const inc = action === 'remove' ? -1 : 1
    const doc = await SiteStats.findOneAndUpdate(
      { key: 'global' },
      { $inc: { likeCount: inc }, $setOnInsert: { visitCount: 0 } },
      { new: true, upsert: true }
    )
    // Clamp likeCount to 0 minimum
    if (doc.likeCount < 0) {
      doc.likeCount = 0
      await doc.save()
    }
    res.json({ likeCount: doc.likeCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
