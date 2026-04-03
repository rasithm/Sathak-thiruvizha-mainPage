import express from 'express'
import SiteStats from '../models/SiteStats.js'
import rateLimit from 'express-rate-limit'
const router = express.Router()

// ── Helper: get-or-create the single global doc ───────────────
async function getStats() {
  let doc = await SiteStats.findOne({ key: 'global' })
  if (!doc) doc = await SiteStats.create({ key: 'global' })
  return doc
}

function getIP(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket.remoteAddress
}


const likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50
})



// ── GET /api/sitestats
// Returns { visitCount, likeCount }
// Also increments visitCount on every call (each page load = 1 visit)
router.get('/', async (req, res) => {
  try {
    const ip = getIP(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    const visitorId = `${ip}_${userAgent}`

    let doc = await SiteStats.findOne({ key: 'global' })

    // ✅ If no doc → create with defaults
    if (!doc) {
      doc = await SiteStats.create({
        key: 'global',
        visitCount: 849,   
        likeCount: 538     
      })
    }

    
    if (!doc.visitorsMap) {
      doc.visitorsMap = {}
    }

    const now = Date.now()
    const SESSION_TIME = 30 * 60 * 1000

    const lastVisit = doc.visitorsMap[visitorId]

    if (!lastVisit || (now - lastVisit) > SESSION_TIME) {
      doc.visitCount += 1
      doc.visitorsMap[visitorId] = now
      await doc.save()
    }

    return res.json({
      visitCount: doc.visitCount,
      likeCount: doc.likeCount
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ── POST /api/sitestats/like
// Body: { action: 'add' | 'remove' }
// Increments or decrements likeCount. Frontend enforces 1 like per browser.
router.post('/like', async (req, res) => {
  try {
    const ip = getIP(req)

    // 🔒 TRY ADD LIKE ONLY IF NOT EXISTS
    const liked = await SiteStats.findOneAndUpdate(
      {
        key: 'global',
        likedUsers: { $ne: ip }
      },
      {
        $inc: { likeCount: 1 },
        $addToSet: { likedUsers: ip }
      },
      { new: true }
    )

    if (liked) {
      return res.json({ likeCount: liked.likeCount })
    }

    // 🔁 REMOVE LIKE
    const unliked = await SiteStats.findOneAndUpdate(
      {
        key: 'global',
        likedUsers: ip
      },
      {
        $inc: { likeCount: -1 },
        $pull: { likedUsers: ip }
      },
      { new: true }
    )

    res.json({ likeCount: Math.max(0, unliked.likeCount) })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
