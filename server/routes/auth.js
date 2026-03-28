import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// POST /api/auth/login
// Body: { username, password }
router.post('/login', (req, res) => {
  const { username, password } = req.body

  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'habibi2026'

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )

  res.json({ token, message: 'Login successful' })
})

export default router
