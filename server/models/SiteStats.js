import mongoose from 'mongoose'

// Single document that holds global site stats
const siteStatsSchema = new mongoose.Schema({
  key: { type: String, default: 'global', unique: true },

  visitCount: { type: Number, default: 0 },
  visitorsMap: {
    type: Map,
    of: Number,
    default: {}
  },

  likeCount: { type: Number, default: 0 },
  likedUsers: { type: [String], default: [] }, // ✅ ADD THIS
}, { timestamps: true })

export default mongoose.model('SiteStats', siteStatsSchema)
