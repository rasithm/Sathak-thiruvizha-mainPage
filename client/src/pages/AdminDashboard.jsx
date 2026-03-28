import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  adminGetEvents, adminDeleteEvent,
  getDeptPoints, adminGetDeptHistory, adminGetDeptKnown,
  adminAddDeptPoint, adminDeleteDeptPoint, adminExportDeptExcel,
  getMembers, adminDeleteMember,
  adminLogout, isLoggedIn,
} from '../lib/api'
import { DAYS, CATEGORY_FILTERS, CATEGORY_COLORS } from '../lib/config'
import styles from './AdminDashboard.module.css'

const TABS = [
  { id: 'events',  label: '📋 Events'       },
  { id: 'points',  label: '🏆 Dept Points'  },
  { id: 'members', label: '👥 Event Members'},
]

function getEventStatus(ev) {
  if (!ev.date) return null
  try {
    const eventDate = new Date(ev.date)
    if (isNaN(eventDate.getTime())) return null
    const today = new Date(); today.setHours(0,0,0,0)
    const evDay  = new Date(eventDate); evDay.setHours(0,0,0,0)
    if (evDay.getTime() === today.getTime()) return 'active'
    if (evDay > today) return 'upcoming'
    return 'completed'
  } catch { return null }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('events')
  useEffect(() => { if (!isLoggedIn()) navigate('/admin') }, [navigate])
  const handleLogout = () => { adminLogout(); navigate('/admin') }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>✦ SATHAK THIRUVIZHA — ADMIN</div>
        <div className={styles.navTabs}>
          {TABS.map(t => (
            <button type="button" key={t.id}
              className={`${styles.navTab} ${tab === t.id ? styles.navTabActive : ''}`}
              onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className={styles.navActions}>
          <Link to="/leaderboard" className={styles.navLink}>🏆 Leaderboard</Link>
          <Link to="/" className={styles.navLink}>← View Site</Link>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className={styles.content}>
        {tab === 'events'  && <EventsPanel  navigate={navigate} />}
        {tab === 'points'  && <DeptPointsPanel />}
        {tab === 'members' && <MembersPanel navigate={navigate} />}
      </div>
    </div>
  )
}

// ─── EVENTS PANEL ───────────────────────────────────────────
function EventsPanel({ navigate }) {
  const [events,      setEvents]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [dayFilter,   setDayFilter]   = useState('all')
  const [catFilter,   setCatFilter]   = useState('all')
  const [activeFilter,setActiveFilter]= useState('all')

  const load = async () => {
    setLoading(true)
    try {
      const q = {}
      if (dayFilter !== 'all') q.day = dayFilter
      if (catFilter !== 'all') q.category = catFilter
      if (activeFilter === 'active')   q.active = true
      if (activeFilter === 'inactive') q.active = false
      setEvents(await adminGetEvents(q))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [dayFilter, catFilter, activeFilter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try { await adminDeleteEvent(id); setEvents(p => p.filter(e => e._id !== id)) }
    catch (e) { alert('Delete failed: ' + e.message) }
  }

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Events</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className={styles.memberBtn} onClick={() => navigate('/admin/members/new')}>
            👥 Add Event Member
          </button>
          <button type="button" className={styles.addBtn} onClick={() => navigate('/admin/events/new')}>
            + Add Event
          </button>
        </div>
      </div>
      <div className={styles.filters}>
        <select className={styles.select} value={dayFilter} onChange={e => setDayFilter(e.target.value)}>
          <option value="all">All Days</option>
          {DAYS.map(d => <option key={d.id} value={d.id}>{d.label} — {d.theme}</option>)}
        </select>
        <select className={styles.select} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {CATEGORY_FILTERS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select className={styles.select} value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {loading ? <div className={styles.loading}>Loading events...</div>
      : events.length === 0 ? (
        <div className={styles.empty}>No events found.<br/><br/>
          <button type="button" className={styles.addBtn} onClick={() => navigate('/admin/events/new')}>+ Add Event</button>
        </div>
      ) : (
        <div className={styles.eventGrid}>
          {events.map(ev => {
            const ds = getEventStatus(ev)
            return (
              <div key={ev._id} className={styles.eventCard} style={{ '--acc': CATEGORY_COLORS[ev.category] || '#FFD700' }}>
                <div className={styles.eventCardTop}>
                  <span className={styles.eventIcon}>{ev.icon}</span>
                  <div>
                    <span className={styles.eventCat} style={{ color: CATEGORY_COLORS[ev.category] }}>
                      {ev.category?.toUpperCase()}
                    </span>
                    <span className={styles.eventDay}> · {ev.day?.replace('day','Day ')}</span>
                  </div>
                  <div className={styles.badgeGroup}>
                    {ds && (
                      <span className={`${styles.statusBadge} ${styles['ds_'+ds]}`}>
                        {ds === 'active' ? '🟢 Live' : ds === 'upcoming' ? '🔵 Soon' : '✓ Done'}
                      </span>
                    )}
                    <span className={`${styles.statusBadge} ${ev.isActive ? styles.isActive : styles.isInactive}`}>
                      {ev.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <h3 className={styles.eventName}>{ev.name}</h3>
                <p className={styles.eventMeta}>
                  {ev.date && <span>📅 {ev.date}</span>}
                  {ev.time && <span> · ⏱ {ev.time}</span>}
                  {ev.venue && <span> · 📍 {ev.venue}</span>}
                </p>
                <p className={styles.eventMeta}>
                  {ev.entryFee > 0 ? `₹${ev.entryFee} entry` : 'Free'} · {ev.seatCapacity} seats
                </p>
                {ev.cashPrize && <p className={styles.eventPrize}>🏆 {ev.cashPrize}</p>}
                <div className={styles.eventActions}>
                  <button type="button" className={styles.editBtn} onClick={() => navigate(`/admin/events/${ev._id}`)}>✏️ Edit</button>
                  <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(ev._id)}>🗑 Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── DEPT POINTS PANEL ──────────────────────────────────────
const YEAR_OPTIONS = ['1st Year','2nd Year','3rd Year','4th Year','Overall']

function DeptPointsPanel() {
  const [history,   setHistory]   = useState([])
  const [latest,    setLatest]    = useState([])
  const [known,     setKnown]     = useState({ depts:[], years:[] })
  const [loading,   setLoading]   = useState(true)
  const [form,      setForm]      = useState({ deptName:'', year:'', points:'', reason:'' })
  const [useNew,    setUseNew]    = useState(false)
  const [newDept,   setNewDept]   = useState('')
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [histFilter,setHistFilter]= useState('all')

  const load = async () => {
    setLoading(true)
    try {
      const [hist, lat, kn] = await Promise.all([
        adminGetDeptHistory(), getDeptPoints(), adminGetDeptKnown()
      ])
      setHistory(hist); setLatest(lat); setKnown(kn)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    const deptName = useNew ? newDept.trim() : form.deptName
    if (!deptName || !form.year || form.points === '') { setError('Department, Year, and Points are required'); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      await adminAddDeptPoint({ deptName, year: form.year, points: Number(form.points), reason: form.reason.trim() })
      setForm({ deptName:'', year:'', points:'', reason:'' }); setNewDept('')
      setSuccess('Points updated!'); await load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelEntry = async (id) => {
    if (!confirm('Delete this entry?')) return
    try { await adminDeleteDeptPoint(id); setHistory(h => h.filter(x => x._id !== id)) }
    catch { alert('Delete failed') }
  }

  const filteredHist = histFilter === 'all' ? history : history.filter(h => h.deptName === histFilter)

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Department Points</h2>
        <div style={{ display:'flex', gap:10 }}>
          <Link to="/leaderboard" className={styles.viewBtn} target="_blank">🏆 View Leaderboard</Link>
          <button type="button" className={styles.exportBtn} onClick={adminExportDeptExcel}>↓ Export Excel</button>
        </div>
      </div>

      <div className={styles.deptForm}>
        <h3 className={styles.deptFormTitle}>Update Department Points</h3>
        <p className={styles.deptFormNote}>
          Select an existing department to avoid name mismatch, or create a new one. Negative points allowed for deductions.
        </p>
        <div className={styles.modeChips}>
          <button type="button" className={`${styles.modeChip} ${!useNew ? styles.modeChipActive : ''}`} onClick={() => setUseNew(false)}>
            Select Existing
          </button>
          <button type="button" className={`${styles.modeChip} ${useNew ? styles.modeChipActive : ''}`} onClick={() => setUseNew(true)}>
            + New Department
          </button>
        </div>
        <div className={styles.deptFormGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Department *</label>
            {useNew ? (
              <input className={styles.input} placeholder="e.g. CSE, ECE, MECH"
                value={newDept} onChange={e => setNewDept(e.target.value)} />
            ) : (
              <select className={styles.select} value={form.deptName}
                onChange={e => setForm(f => ({ ...f, deptName: e.target.value }))}>
                <option value="">— Select Department —</option>
                {known.depts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Year *</label>
            <select className={styles.select} value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
              <option value="">— Select Year —</option>
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Points * (negative = deduction)</label>
            <input className={styles.input} type="number" placeholder="e.g. 50 or -10"
              value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} />
          </div>
          <div className={styles.field} style={{ gridColumn:'1 / -1' }}>
            <label className={styles.label}>Reason</label>
            <input className={styles.input} placeholder="e.g. Won Code Blitz 1st place"
              value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
        </div>
        {error   && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.successMsg}>✓ {success}</p>}
        <button type="button" className={styles.addBtn} onClick={handleAdd} disabled={saving}>
          {saving ? 'Saving…' : '+ Update Points'}
        </button>
      </div>

      {/* Current standings */}
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Current Standings <span className={styles.sectionSub}>(latest per dept+year)</span></h3>
      </div>
      {loading ? <div className={styles.loading}>Loading...</div>
      : latest.length === 0 ? <div className={styles.empty}>No department points yet.</div>
      : (
        <div className={styles.pointsGrid}>
          {latest.map((d, i) => (
            <div key={`${d.deptName}-${d.year}-${i}`} className={styles.pointCard}>
              <div className={styles.pointRank}>#{i+1}</div>
              <div className={styles.pointInfo}>
                <div className={styles.pointDept}>{d.deptName}</div>
                <div className={styles.pointYear}>{d.year}</div>
                {d.reason && <div className={styles.pointReason}>{d.reason}</div>}
              </div>
              <div className={`${styles.pointScore} ${d.points < 0 ? styles.negScore : ''}`}>
                {d.points >= 0 ? '+' : ''}{d.points} pts
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full history */}
      <div className={styles.sectionHead} style={{ marginTop:40 }}>
        <h3 className={styles.sectionTitle}>Update History <span className={styles.sectionSub}>(latest first)</span></h3>
        <select className={styles.select} value={histFilter} onChange={e => setHistFilter(e.target.value)} style={{ minWidth:160 }}>
          <option value="all">All Departments</option>
          {known.depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {!loading && history.length > 0 && (
        <div className={styles.histTable}>
          <div className={styles.histHeader}>
            <span>#</span><span>Department</span><span>Year</span>
            <span>Change</span><span>Total</span><span>Reason</span><span>Updated</span><span>Del</span>
          </div>
          {/* newest first — server returns newest-first, display as-is */}
          {filteredHist.map((h, i) => (
            <div key={h._id} className={styles.histRow}>
              <span className={styles.histNum}>{i+1}</span>
              <span className={styles.histDept}>{h.deptName}</span>
              <span className={styles.histYear}>{h.year}</span>
              <span className={`${styles.histPts} ${(h.delta ?? h.points) < 0 ? styles.negative : styles.positive}`}>
                {(h.delta ?? h.points) >= 0 ? '+' : ''}{h.delta ?? h.points}
              </span>
              <span className={`${styles.histPts} ${(h.cumulative ?? h.points) < 0 ? styles.negative : ''}`} style={{fontWeight:700}}>
                {h.cumulative ?? '—'}
              </span>
              <span className={styles.histReason}>{h.reason || '—'}</span>
              <span className={styles.histDate}>
                {new Date(h.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}
              </span>
              <button type="button" className={styles.histDel} onClick={() => handleDelEntry(h._id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MEMBERS PANEL ──────────────────────────────────────────
function rolePriority(role) {
  const r = role?.toLowerCase()
  if (r === 'organiser')    return 0
  if (r === 'co-organiser') return 1
  return 2
}

function MembersPanel({ navigate }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState({})

  const load = async () => {
    setLoading(true)
    try { setMembers(await getMembers()) } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return
    try { await adminDeleteMember(id); setMembers(m => m.filter(x => x._id !== id)) }
    catch { alert('Delete failed') }
  }

  const groups = {}
  members.forEach(m => {
    if (!groups[m.eventSlug]) groups[m.eventSlug] = { eventName: m.eventName, slug: m.eventSlug, members: [] }
    groups[m.eventSlug].members.push(m)
  })
  Object.values(groups).forEach(g => {
    g.members.sort((a,b) => {
      if (a.tagNo !== b.tagNo) return a.tagNo - b.tagNo
      const rp = rolePriority(a.role) - rolePriority(b.role)
      if (rp !== 0) return rp
      return new Date(a.createdAt) - new Date(b.createdAt)
    })
  })
  const groupList = Object.values(groups).sort((a,b) => {
    const aMin = Math.min(...a.members.map(m => m.tagNo||99))
    const bMin = Math.min(...b.members.map(m => m.tagNo||99))
    return aMin - bMin
  })

  const roleClass = (role) => {
    const r = role?.toLowerCase()
    if (r === 'organiser')    return styles.roleOrganiser
    if (r === 'co-organiser') return styles.roleCoOrganiser
    return styles.roleOther
  }

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Event Members</h2>
        <button type="button" className={styles.addBtn} onClick={() => navigate('/admin/members/new')}>+ Add Member</button>
      </div>
      {loading ? <div className={styles.loading}>Loading...</div>
      : members.length === 0 ? (
        <div className={styles.empty}>No members yet.
          <br/><br/>
          <button type="button" className={styles.addBtn} onClick={() => navigate('/admin/members/new')}>+ Add First Member</button>
        </div>
      ) : (
        <div className={styles.memberGroups}>
          {groupList.map(g => (
            <div key={g.slug} className={styles.memberGroup}>
              <div className={styles.memberGroupHeader} onClick={() => setCollapsed(c => ({ ...c, [g.slug]: !c[g.slug] }))}>
                <span className={styles.memberGroupName}>{g.eventName}</span>
                <span className={styles.memberGroupCount}>{g.members.length} members</span>
                <span className={styles.memberGroupToggle}>{collapsed[g.slug] ? '▶' : '▼'}</span>
              </div>
              {!collapsed[g.slug] && (
                <div className={styles.memberList}>
                  {g.members.map(m => (
                    <div key={m._id} className={styles.memberRow}>
                      <div className={styles.memberAvatar}>
                        {m.photo
                          ? <img src={m.photo} alt={m.name} className={styles.memberAvatarImg}/>
                          : <div className={styles.memberAvatarFb}>{m.name[0]?.toUpperCase()}</div>
                        }
                      </div>
                      <div className={styles.memberRowInfo}>
                        <div className={styles.memberRowName}>{m.name}</div>
                        <div className={styles.memberRowMeta}>{m.dept} · {m.year}</div>
                      </div>
                      <span className={`${styles.roleBadge} ${roleClass(m.role)}`}>{m.role}</span>
                      <span className={styles.memberTag}>{m.tagCode || `Tag #${m.tagNo}`}</span>
                      <div className={styles.memberRowActions}>
                        <button type="button" className={styles.editBtn} onClick={() => navigate(`/admin/members/${m._id}`)}>✏️</button>
                        <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(m._id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
