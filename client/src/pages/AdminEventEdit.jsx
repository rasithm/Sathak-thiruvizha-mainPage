import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { adminGetEvents, adminCreateEvent, adminUpdateEvent, isLoggedIn } from '../lib/api'
import { DAYS } from '../lib/config'
import styles from './AdminEventEdit.module.css'

const CATEGORIES = ['technical', 'cultural', 'special', 'hackathon']
const ICONS = ['🎯','💻','⚡','🤖','🚀','📄','🎤','💃','👑','🏆','🔥','🎶','🎨','🎭','🏅','🧠','🌐','📊','🎪','🎓']

// Map day id → auto date
const DAY_DATES = {
  day1: 'April 6, 2026',
  day2: 'April 7, 2026',
  day3: 'April 8, 2026',
  day4: 'April 9, 2026',
  day5: 'April 10, 2026',
  day6: 'April 11, 2026',
  day7: 'April 13, 2026',
  day8: 'April 15, 2026',
  day9: 'April 16, 2026',
  day10: 'April 17, 2026',
}

const EMPTY = {
  slug: '', name: '', tagline: '', description: '',
  icon: '🎯', accent: '#FFD700',
  day: 'day1', date: DAY_DATES['day1'], startTime: '', endTime: '', time: '', duration: '',
  category: 'technical',
  venue: '', seatCapacity: 100, teamSize: 'Individual',
  entryFee: 0,
  googleFormLink: '', hackathonLink: '',
  isHackathon: false,
  cashPrize: '',
  perks: '',
  features: '',
  order: 1, isActive: true,
}

// Calculate duration from start+end time strings like "09:00" and "12:00"
function calcDuration(start, end) {
  if (!start || !end) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  if (isNaN(sh) || isNaN(eh)) return ''
  const totalMins = (eh * 60 + em) - (sh * 60 + sm)
  if (totalMins <= 0) return ''
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  if (hrs === 0) return `${mins} min`
  if (mins === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`
  return `${hrs} hr ${mins} min`
}

// Format display time from start+end like "09:00" → "9:00 AM – 12:00 PM"
function formatDisplayTime(start, end) {
  const fmt = (t) => {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    if (isNaN(h)) return t
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2,'0')} ${period}`
  }
  const s = fmt(start)
  const e = fmt(end)
  if (s && e) return `${s} – ${e}`
  if (s) return s
  return ''
}

export default function AdminEventEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form,         setForm]         = useState(EMPTY)
  const [loading,      setLoading]      = useState(!isNew)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState('')
  const [takenOrders,  setTakenOrders]  = useState([])

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/admin'); return }

    // Load all events to know taken orders and find this event
    adminGetEvents()
      .then(events => {
        // Collect taken orders for the current day (excluding current event when editing)
        const sameDay = events.filter(e => e.day === (isNew ? 'day1' : (events.find(x => x._id === id)?.day || 'day1')) && (!isNew ? e._id !== id : true))
        setTakenOrders(sameDay.map(e => e.order))

        if (!isNew) {
          const ev = events.find(e => e._id === id)
          if (!ev) { setError('Event not found'); return }
          // Parse time back to start/end if it has "–" separator
          let startTime = '', endTime = ''
          if (ev.time && ev.time.includes('–')) {
            const parts = ev.time.split('–').map(s => s.trim())
            startTime = parseDisplayTime(parts[0])
            endTime = parseDisplayTime(parts[1])
          }
          setForm({
            ...EMPTY,
            ...ev,
            perks:    (ev.perks    || []).join(', '),
            features: (ev.features || []).join(', '),
            startTime, endTime,
          })
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isNew, navigate])

  // When day changes, update taken orders and auto-fill date
  const handleDayChange = (newDay) => {
    set('day', newDay)
    set('date', DAY_DATES[newDay] || '')
    // Re-fetch taken orders for new day
    adminGetEvents()
      .then(events => {
        const sameDay = events.filter(e => e.day === newDay && (!isNew ? e._id !== id : true))
        setTakenOrders(sameDay.map(e => e.order))
      })
      .catch(() => {})
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleTimeChange = (key, val) => {
    const newForm = { ...form, [key]: val }
    const st = key === 'startTime' ? val : form.startTime
    const et = key === 'endTime' ? val : form.endTime
    const dur = calcDuration(st, et)
    const displayTime = formatDisplayTime(st, et)
    setForm(f => ({ ...f, [key]: val, duration: dur || f.duration, time: displayTime || f.time }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Event name is required'); return }
    if (isNew && !form.slug.trim()) { setError('Slug (URL id) is required'); return }
    if (!form.day) { setError('Day is required'); return }
    if (!form.category) { setError('Category is required'); return }

    setSaving(true)
    setError('')
    setSuccess('')

    // Build display time from start+end if available
    const displayTime = form.startTime || form.endTime
      ? formatDisplayTime(form.startTime, form.endTime)
      : form.time

    const payload = {
      ...form,
      time: displayTime,
      perks:    form.perks    ? form.perks.split(',').map(s => s.trim()).filter(Boolean)    : [],
      features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      seatCapacity: Number(form.seatCapacity) || 0,
      entryFee:     Number(form.entryFee)     || 0,
      order:        Number(form.order)        || 1,
    }
    // Remove internal fields
    delete payload.startTime
    delete payload.endTime

    try {
      if (isNew) {
        await adminCreateEvent(payload)
        setSuccess('Event created!')
        setTimeout(() => navigate('/admin/dashboard'), 1200)
      } else {
        await adminUpdateEvent(id, payload)
        setSuccess('Event updated successfully!')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingSpinner} />
      <p>Loading event...</p>
    </div>
  )

  // Build available order options (1–20 excluding taken)
  const orderOptions = Array.from({ length: 20 }, (_, i) => i + 1)
    .filter(n => !takenOrders.includes(n) || n === Number(form.order))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/admin/dashboard" className={styles.back}>← Dashboard</Link>
        <h1 className={styles.title}>{isNew ? '✦ New Event' : `Edit: ${form.name}`}</h1>
        <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : isNew ? 'Create Event' : 'Save Changes'}
        </button>
      </div>

      {error   && <div className={styles.error}>⚠️ {error}</div>}
      {success && <div className={styles.success}>✅ {success}</div>}

      <div className={styles.formWrap}>

        {/* ── 1. Identity ── */}
        <Section title="📝 Identity">
          <Row>
            <Field label="Event Name *">
              <input className={styles.input} value={form.name}
                onChange={e => {
                  set('name', e.target.value)
                  if (isNew) set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                }} placeholder="e.g. Code Blitz" />
            </Field>
            <Field label="Slug (URL ID) *">
              <input className={styles.input} value={form.slug}
                onChange={e => set('slug', e.target.value)}
                placeholder="e.g. code-blitz"
                readOnly={!isNew}
                style={!isNew ? { opacity: 0.5 } : {}} />
            </Field>
          </Row>
          <Row>
            <Field label="Tagline">
              <input className={styles.input} value={form.tagline}
                onChange={e => set('tagline', e.target.value)} placeholder="Short catchy line" />
            </Field>
            <Field label="Accent Color">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={form.accent} onChange={e => set('accent', e.target.value)}
                  style={{ width: 48, height: 48, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                <input className={styles.input} value={form.accent}
                  onChange={e => set('accent', e.target.value)} style={{ flex: 1 }} />
              </div>
            </Field>
          </Row>
          <Field label="Icon (pick or type emoji)">
            <div className={styles.iconGrid}>
              {ICONS.map(ic => (
                <button type="button" key={ic} 
                  className={`${styles.iconBtn} ${form.icon === ic ? styles.iconBtnActive : ''}`}
                  onClick={() => set('icon', ic)}>
                  {ic}
                </button>
              ))}
              <input className={styles.input} value={form.icon}
                onChange={e => set('icon', e.target.value)}
                style={{ width: 56, textAlign: 'center', fontSize: 22 }} placeholder="✦" />
            </div>
          </Field>
          <Field label="Description">
            <textarea className={styles.textarea} rows={4} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Full event description shown to students" />
          </Field>
        </Section>

        {/* ── 2. Schedule & Venue ── */}
        <Section title="📅 Schedule & Venue">
          <Row>
            <Field label="Day *">
              <select className={styles.select} value={form.day} onChange={e => handleDayChange(e.target.value)}>
                {DAYS.map(d => (
                  <option key={d.id} value={d.id}>{d.label} — {d.date} — {d.theme}</option>
                ))}
              </select>
            </Field>
            <Field label="Category *">
              <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>
          </Row>

          {/* Date auto-filled from day */}
          <Row>
            <Field label="Date (auto-filled from day)">
              <input className={styles.input} value={form.date}
                onChange={e => set('date', e.target.value)}
                placeholder="April 6, 2026" />
              <span className={styles.hint}>Auto-filled when you select a day. Edit if needed.</span>
            </Field>
            <Field label="Display Order (1–20)">
              <select className={styles.select} value={form.order} onChange={e => set('order', Number(e.target.value))}>
                {orderOptions.map(n => (
                  <option key={n} value={n}>Order {n}{n === Number(form.order) && !isNew ? ' (current)' : ''}</option>
                ))}
                {orderOptions.length === 0 && <option value={form.order}>Order {form.order}</option>}
              </select>
              <span className={styles.hint}>Controls card display position. Taken orders are hidden.</span>
            </Field>
          </Row>

          {/* Time: start + end → auto duration */}
          <div className={styles.timeBlock}>
            <p className={styles.timeBlockLabel}>⏱ Time</p>
            <div className={styles.timeRow}>
              <Field label="Start Time">
                <input type="time" className={styles.input} value={form.startTime}
                  onChange={e => handleTimeChange('startTime', e.target.value)} />
              </Field>
              <div className={styles.timeSep}>to</div>
              <Field label="End Time">
                <input type="time" className={styles.input} value={form.endTime}
                  onChange={e => handleTimeChange('endTime', e.target.value)} />
              </Field>
              <Field label="Duration (auto / override)">
                <input className={styles.input} value={form.duration}
                  onChange={e => set('duration', e.target.value)}
                  placeholder="e.g. 3 hrs, Full Day, 25 hrs" />
                <span className={styles.hint}>Auto-calculated from start/end time. Edit to override.</span>
              </Field>
            </div>
            {form.time && (
              <div className={styles.timePreview}>
                Display: <strong>{form.time}</strong>
                {form.duration && <> · Duration: <strong>{form.duration}</strong></>}
              </div>
            )}
          </div>

          <Row>
            <Field label="Venue">
              <input className={styles.input} value={form.venue}
                onChange={e => set('venue', e.target.value)}
                placeholder="e.g. CS Lab Block, MSAJCE" />
            </Field>
          </Row>
        </Section>

        {/* ── 3. Registration ── */}
        <Section title="🎟 Registration & Fees">
          <Row>
            <Field label="Seat Capacity">
              <input className={styles.input} type="number" value={form.seatCapacity}
                onChange={e => set('seatCapacity', e.target.value)} placeholder="100" />
            </Field>
            <Field label="Team Size">
              <input className={styles.input} value={form.teamSize}
                onChange={e => set('teamSize', e.target.value)}
                placeholder="e.g. 1–3, Individual, 2–4 Members" />
            </Field>
            <Field label="Entry Fee (₹)">
              <input className={styles.input} type="number" value={form.entryFee}
                onChange={e => set('entryFee', e.target.value)} placeholder="0 = Free" />
            </Field>
          </Row>

          <Field label="Google Form Registration Link">
            <input className={styles.input} value={form.googleFormLink}
              onChange={e => set('googleFormLink', e.target.value)}
              placeholder="https://forms.google.com/... (students click Register → opens this)" />
          </Field>

          {/* Hackathon section — always shown */}
          <div className={styles.hackSection}>
            <div className={styles.hackToggle}>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={form.isHackathon}
                  onChange={e => set('isHackathon', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#00FF88' }} />
                <span>Mark as Hackathon event</span>
                <span className={styles.hackBadge}>Day 4 · 25 hrs</span>
              </label>
            </div>
            <Field label="Hackathon Registration Link (separate website link)">
              <input className={styles.input} value={form.hackathonLink}
                onChange={e => set('hackathonLink', e.target.value)}
                placeholder="https://... (hackathon-specific registration page)"
                style={form.isHackathon ? { borderColor: 'rgba(0,255,136,0.4)' } : {}} />
              <span className={styles.hint}>
                {form.isHackathon
                  ? '✅ Hackathon mode ON — Register button will open this link'
                  : 'If provided, this overrides the Google Form link for this event'}
              </span>
            </Field>
          </div>
        </Section>

        {/* ── 4. Prizes & Features ── */}
        <Section title="🏆 Prizes & Features">
          <Field label="Cash Prize">
            <input className={styles.input} value={form.cashPrize}
              onChange={e => set('cashPrize', e.target.value)}
              placeholder="e.g. ₹10,000 (shown on card)" />
          </Field>
          <Field label="Perks (comma-separated)">
            <input className={styles.input} value={form.perks}
              onChange={e => set('perks', e.target.value)}
              placeholder="Certificate, Trophy, Cash Prize, Internship Shortlist" />
          </Field>
          <Field label="Features / Rounds / Activities (comma-separated)">
            <textarea className={styles.textarea} rows={3} value={form.features}
              onChange={e => set('features', e.target.value)}
              placeholder="Round 1 — Quiz, Round 2 — Coding, Finals — Presentation" />
          </Field>
        </Section>

        {/* ── 5. Visibility ── */}
        <Section title="👁 Visibility">
          <div className={styles.visibilityRow}>
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={e => set('isActive', e.target.checked)}
              style={{ width: 20, height: 20, accentColor: '#00FF88', cursor: 'pointer' }} />
            <label htmlFor="isActive" style={{ cursor: 'pointer' }}>
              <strong style={{ color: form.isActive ? '#00FF88' : '#ff6b6b' }}>
                {form.isActive ? '✅ Active — visible on website' : '❌ Hidden — not shown on site'}
              </strong>
              <span style={{ color: 'var(--text-dim)', fontSize: 13, marginLeft: 12 }}>
                Toggle to show/hide this event from the public site
              </span>
            </label>
          </div>
        </Section>
      </div>

      <div className={styles.bottomActions}>
        <Link to="/admin/dashboard" className={styles.cancelBtn}>Cancel</Link>
        <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : isNew ? 'Create Event' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ── Parse display time "9:00 AM" → "09:00" ────────────────────
function parseDisplayTime(str) {
  if (!str) return ''
  const match = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return ''
  let h = parseInt(match[1])
  const m = match[2]
  const period = match[3].toUpperCase()
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2,'0')}:${m}`
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Row({ children }) {
  return <div className={styles.row}>{children}</div>
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}
