import express from 'express'
import DepartmentPoint from '../models/DepartmentPoint.js'
import { authMiddleware } from '../middleware/auth.js'
import * as XLSX from 'xlsx'

const router = express.Router()

// Helper: aggregate cumulative totals per dept+year
async function getCumulativeTotals() {
  return DepartmentPoint.aggregate([
    { $group: {
        _id: { deptName: '$deptName', year: '$year' },
        deptName:  { $first: '$deptName' },
        year:      { $first: '$year' },
        points:    { $sum: '$points' },         // CUMULATIVE SUM
        lastReason:{ $last: '$reason' },
        updatedAt: { $max: '$createdAt' },
    }},
    { $sort: { points: -1 } },
  ])
}

// GET /api/deptpoints — cumulative totals per dept+year, sorted desc
router.get('/', async (req, res) => {
  try {
    const totals = await getCumulativeTotals()
    // Map to same shape consumers expect
    const result = totals.map(d => ({
      _id:       d._id,
      deptName:  d.deptName,
      year:      d.year,
      points:    d.points,
      reason:    d.lastReason,
      updatedAt: d.updatedAt,
    }))
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/deptpoints/known — distinct dept names and years (admin, for dropdowns)
router.get('/known', authMiddleware, async (req, res) => {
  try {
    const depts = await DepartmentPoint.distinct('deptName')
    const years = await DepartmentPoint.distinct('year')
    res.json({ depts: depts.sort(), years: years.sort() })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/deptpoints/history — full raw history with running totals (admin)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const all = await DepartmentPoint.find().sort({ createdAt: 1 }) // oldest first

    // Compute running cumulative total per dept+year
    const running = {}
    const enriched = all.map(h => {
      const key = `${h.deptName}::${h.year}`
      running[key] = (running[key] || 0) + h.points
      return {
        _id:        h._id,
        deptName:   h.deptName,
        year:       h.year,
        delta:      h.points,         // the change added this update
        cumulative: running[key],     // running total after this update
        reason:     h.reason,
        createdAt:  h.createdAt,
      }
    })

    res.json(enriched.reverse()) // return newest first for display
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/deptpoints — admin adds delta entry (cumulative history kept)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { deptName, year, points, reason } = req.body
    if (!deptName || !year || points === undefined)
      return res.status(400).json({ error: 'deptName, year, points required' })

    const entry = new DepartmentPoint({
      deptName: deptName.trim(),
      year: year.trim(),
      points: Number(points),   // delta (+ve or -ve)
      reason: (reason || '').trim()
    })
    await entry.save()

    // Return the new cumulative total for this dept+year
    const agg = await DepartmentPoint.aggregate([
      { $match: { deptName: deptName.trim(), year: year.trim() } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ])
    const total = agg[0]?.total || 0

    res.status(201).json({ ...entry.toObject(), cumulative: total })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/deptpoints/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await DepartmentPoint.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/deptpoints/export — Excel download
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const all = await DepartmentPoint.find().sort({ createdAt: 1 })
    const running = {}
    const rows = all.map((d, i) => {
      const key = `${d.deptName}::${d.year}`
      running[key] = (running[key] || 0) + d.points
      return {
        'S.No': i + 1,
        'Department': d.deptName,
        'Year': d.year,
        'Delta': d.points >= 0 ? `+${d.points}` : `${d.points}`,
        'Cumulative': running[key],
        'Reason': d.reason || '',
        'Updated At': new Date(d.createdAt).toLocaleString('en-IN'),
      }
    })
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows.reverse())
    ws['!cols'] = [{ wch:6 },{ wch:20 },{ wch:12 },{ wch:10 },{ wch:12 },{ wch:40 },{ wch:22 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Department Points')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Disposition', 'attachment; filename="dept_points.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buf)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
