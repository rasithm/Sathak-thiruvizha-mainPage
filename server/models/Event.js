import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  // Identity
  slug: { type: String, required: true, unique: true },  // e.g. "code-blitz"

  // Basic info
  name:        { type: String, required: true },
  tagline:     { type: String, default: '' },
  description: { type: String, default: '' },
  icon:        { type: String, default: '🎯' },
  accent:      { type: String, default: '#FFD700' },

  // Schedule
  day:      { type: String, enum: ['day1','day2','day3','day4','day5','day6','day7','day8','day9','day10'], required: true },
  date:     { type: String, default: '' },   // e.g. "April 6, 2026"
  time:     { type: String, default: '' },   // e.g. "9AM–6PM"
  duration: { type: String, default: '' },   // e.g. "3 hrs"

  // Category
  category: {
    type: String,
    enum: ['technical', 'cultural', 'special', 'hackathon'],
    required: true,
  },

  // Venue & capacity
  venue:        { type: String, default: '' },
  seatCapacity: { type: Number, default: 100 },
  teamSize:     { type: String, default: 'Individual' },

  // Registration
  entryFee:       { type: Number, default: 0 },
  googleFormLink: { type: String, default: '' },  // students click Register → go here
  isHackathon:    { type: Boolean, default: false },
  hackathonLink:  { type: String, default: '' },  // special link for hackathon

  // Prizes & perks
  cashPrize: { type: String, default: '' },   // e.g. "₹10,000"
  perks:     [{ type: String }],              // ["Certificate", "Trophy"]
  features:  [{ type: String }],             // extra features/activities

  // Display order (lower = first)
  order: { type: Number, default: 0 },

  // Visibility
  isActive: { type: Boolean, default: true },

}, { timestamps: true })

export default mongoose.model('Event', eventSchema)
