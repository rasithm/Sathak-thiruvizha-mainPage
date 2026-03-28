import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminGetEvents, adminCreateMember, adminUpdateMember, adminGetNextTag, getMembers } from '../lib/api'
import styles from './AdminMemberEdit.module.css'

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const PRESET_ROLES = ['organiser', 'co-organiser', 'other']

export default function AdminMemberEdit() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id

  const [events,       setEvents]      = useState([])
  const [loading,      setLoading]     = useState(!isNew)
  const [saving,       setSaving]      = useState(false)
  const [error,        setError]       = useState('')
  const [success,      setSuccess]     = useState('')
  const [nextTag,      setNextTag]     = useState(null)  // { tagNo, tagCode }

  const [form, setForm] = useState({
    eventSlug: '', eventName: '', regNo: '', name: '',
    dept: '', year: '', role: '', photo: '', linkedin: '',
    email: '', phone: '', portfolio: '',
  })
  const [rolePreset,  setRolePreset]  = useState('organiser')
  const [customRole,  setCustomRole]  = useState('')
  const [photoPreview, setPhotoPreview] = useState('')

  // Load all events
  useEffect(() => {
    adminGetEvents().then(evs => setEvents(evs)).catch(console.error)
  }, [])

  // Load existing member for edit
  useEffect(() => {
    if (isNew) return
    getMembers().then(all => {
      const m = all.find(x => x._id === id)
      if (!m) { navigate('/admin/dashboard'); return }
      const rLower = m.role?.toLowerCase()
      const isPreset = rLower === 'organiser' || rLower === 'co-organiser'
      setForm({
        eventSlug: m.eventSlug || '', eventName: m.eventName || '',
        regNo: m.regNo || '', name: m.name || '',
        dept: m.dept || '', year: m.year || '',
        role: m.role || '', photo: m.photo || '',
        linkedin: m.linkedin || '', email: m.email || '',
        phone: m.phone || '', portfolio: m.portfolio || '',
      })
      setRolePreset(isPreset ? rLower : 'other')
      if (!isPreset) setCustomRole(m.role || '')
      if (m.photo) setPhotoPreview(m.photo)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id, isNew, navigate])

  // When event changes (create mode), fetch next tagNo
  const handleEventChange = (slug) => {
    const ev = events.find(e => e.slug === slug)
    setForm(f => ({ ...f, eventSlug: slug, eventName: ev ? ev.name : '' }))
    setNextTag(null)
    if (slug) {
      adminGetNextTag(slug).then(setNextTag).catch(() => setNextTag(null))
    }
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Photo must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = ev => { setPhotoPreview(ev.target.result); setForm(f => ({ ...f, photo: ev.target.result })) }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setError(''); setSuccess('')
    const finalRole = rolePreset === 'other' ? customRole.trim() : rolePreset
    if (!form.eventSlug || !form.name.trim() || !form.dept.trim() || !form.year || !finalRole) {
      setError('Event, Name, Dept, Year and Role are required.'); return
    }
    setSaving(true)
    try {
      const payload = { ...form, role: finalRole }
      if (isNew) await adminCreateMember(payload)
      else       await adminUpdateMember(id, payload)
      setSuccess(isNew ? 'Member created!' : 'Member updated!')
      setTimeout(() => navigate('/admin/dashboard'), 900)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className={styles.loading}>Loading…</div>

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/admin/dashboard')}>← Back</button>
          <h1 className={styles.title}>{isNew ? '+ Add Event Member' : 'Edit Member'}</h1>
        </div>

        {/* Event Selector */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Event</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Select Event *</label>
              <select className={styles.select} value={form.eventSlug} onChange={e => handleEventChange(e.target.value)}>
                <option value="">— Choose Event —</option>
                {events.map(ev => <option key={ev._id} value={ev.slug}>{ev.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tag Code (auto-generated)</label>
              <div className={styles.tagPreview}>
                {isNew ? (
                  nextTag
                    ? <><span className={styles.tagCodeBig}>{nextTag.tagCode}</span><span className={styles.tagNumSub}>Tag #{nextTag.tagNo}</span></>
                    : <span className={styles.tagPlaceholder}>{form.eventSlug ? 'Loading…' : 'Select event first'}</span>
                ) : (
                  <span className={styles.tagCodeBig}>{form.eventSlug ? `tag assigned` : '—'}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Member Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Member Details</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Register No *</label>
              <input className={styles.input} placeholder="e.g. 22CS001"
                value={form.regNo} onChange={e => setForm(f => ({ ...f, regNo: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Full Name *</label>
              <input className={styles.input} placeholder="e.g. Rahul Kumar"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Department *</label>
              <input className={styles.input} placeholder="e.g. CSE, ECE, MECH"
                value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year *</label>
              <select className={styles.select} value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                <option value="">— Select Year —</option>
                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Role */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Role *</h2>
          <div className={styles.roleChips}>
            {PRESET_ROLES.map(r => (
              <button type="button" key={r}
                className={`${styles.roleChip} ${rolePreset === r ? styles.roleChipActive : ''}`}
                onClick={() => setRolePreset(r)}>
                {r === 'organiser' ? '⭐ Organiser' : r === 'co-organiser' ? '✦ Co-Organiser' : '+ Other'}
              </button>
            ))}
          </div>
          {rolePreset === 'other' && (
            <input className={`${styles.input} ${styles.mt10}`} placeholder="Custom role e.g. Volunteer, Coordinator"
              value={customRole} onChange={e => setCustomRole(e.target.value)} />
          )}
        </section>

        {/* Photo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Photo <span className={styles.optLabel}>(optional)</span></h2>
          <div className={styles.photoRow}>
            {photoPreview
              ? <div className={styles.photoPreview}>
                  <img src={photoPreview} alt="preview" />
                  <button type="button" className={styles.photoRemove} onClick={() => { setPhotoPreview(''); setForm(f => ({ ...f, photo: '' })) }}>✕</button>
                </div>
              : <div className={styles.photoPlaceholder}>📷</div>
            }
            <div>
              <label className={styles.uploadBtn}>
                📁 Choose Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              </label>
              <p className={styles.photoHint}>Max 2MB · JPG, PNG, WebP</p>
            </div>
          </div>
        </section>

        {/* Optional Links */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Social Links <span className={styles.optLabel}>(all optional)</span></h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>LinkedIn URL</label>
              <input className={styles.input} placeholder="https://linkedin.com/in/…"
                value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Portfolio URL</label>
              <input className={styles.input} placeholder="https://yourportfolio.com"
                value={form.portfolio} onChange={e => setForm(f => ({ ...f, portfolio: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" placeholder="student@college.edu"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone No</label>
              <input className={styles.input} placeholder="+91 9876543210"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
        </section>

        {error   && <div className={styles.error}>⚠️ {error}</div>}
        {success && <div className={styles.successMsg}>✓ {success}</div>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/dashboard')}>Cancel</button>
          <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : isNew ? '✦ Add Member' : '✦ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
