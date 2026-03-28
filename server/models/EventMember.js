import mongoose from 'mongoose'

const eventMemberSchema = new mongoose.Schema({
  eventSlug: { type: String, required: true },
  eventName: { type: String, required: true },
  tagNo:     { type: Number, required: true, default: 1 },
  tagCode:   { type: String, default: '' },  // e.g. "tech001", auto-generated
  regNo:     { type: String, default: '' },  // student registration number
  name:      { type: String, required: true },
  dept:      { type: String, required: true },
  year:      { type: String, required: true },
  role:      { type: String, required: true },
  photo:     { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  email:     { type: String, default: '' },
  phone:     { type: String, default: '' },
  portfolio: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('EventMember', eventMemberSchema)
