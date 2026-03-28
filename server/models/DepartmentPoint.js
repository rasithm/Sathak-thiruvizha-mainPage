import mongoose from 'mongoose'

// Each document = one update entry (full history kept)
const deptPointSchema = new mongoose.Schema({
  deptName: { type: String, required: true },
  year:     { type: String, required: true },   // e.g. "2026" or "1st Year"
  points:   { type: Number, required: true },   // the CURRENT point value (not accumulated)
  reason:   { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('DepartmentPoint', deptPointSchema)
