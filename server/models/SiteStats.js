import mongoose from 'mongoose'

// Single document that holds global site stats
const siteStatsSchema = new mongoose.Schema({
  // Unique key — always "global"
  key: { type: String, default: 'global', unique: true },

  // Total page visits (incremented on every visit)
  visitCount: { type: Number, default: 0 },

  // Total likes (incremented when a new browser likes)
  likeCount: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('SiteStats', siteStatsSchema)
