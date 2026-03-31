import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getMembersByEvent } from '../lib/api'
import styles from './OrganisersPage.module.css'

/* ── Helpers ─────────────────────────────────────────────────── */
function rolePriority(role) {
  const r = role?.toLowerCase()
  if (r === 'organiser')    return 0
  if (r === 'co-organiser') return 1
  return 2
}

function roleColorClass(role) {
  const r = role?.toLowerCase()
  if (r === 'organiser')    return styles.roleGold
  if (r === 'co-organiser') return styles.roleCyan
  return styles.roleWhite
}

/* ── Member Card ─────────────────────────────────────────────── */
function MemberCard({ member }) {
  const initials = member.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className={styles.card}>
      <div className={styles.cardGlow} />
      <div className={styles.avatarWrap}>
        {member.photo
          ? <img src={member.photo} alt={member.name} className={styles.avatarImg} />
          : <div className={styles.avatarFb}>{initials}</div>
        }
        <div className={styles.avatarRing} />
      </div>
      <div className={styles.cardBody}>
        <div className={`${styles.roleBadge} ${roleColorClass(member.role)}`}>{member.role}</div>
        <h3 className={styles.cardName}>{member.name}</h3>
        <p className={styles.cardMeta}>{member.dept} · {member.year}</p>
        {member.tagCode && <p className={styles.cardTagCode}>{member.tagCode}</p>}
        {member.regNo   && <p className={styles.cardRegNo}>Reg: {member.regNo}</p>}
        <div className={styles.socialLinks}>
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {member.portfolio && (
            <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Portfolio">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className={styles.socialBtn} title="Email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          )}
          {member.phone && (
            <a href={`tel:${member.phone}`} className={styles.socialBtn} title="Phone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.56 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 5.93 5.93l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Event Member Grid
   Desktop: auto-fill — cards fill each row, next card goes to same
            row if space exists, else wraps to new row.
   Mobile (≤768px): show first 3 cards, "See More" expands all,
                    "Show Less" collapses back.
─────────────────────────────────────────────────────────────── */
function EventMemberGrid({ members, eventSlug }) {
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Collapse when event changes
  useEffect(() => { setExpanded(false) }, [eventSlug])

  // const MOBILE_LIMIT = 3
  const MOBILE_LIMIT = 20
  // On desktop show all; on mobile show MOBILE_LIMIT unless expanded
  const visible = (isMobile && !expanded)
    ? members.slice(0, MOBILE_LIMIT)
    : members

  const hasHidden   = isMobile && !expanded && members.length > MOBILE_LIMIT
  const canCollapse = isMobile && expanded  && members.length > MOBILE_LIMIT

  return (
    <div className={styles.eventMemberSection}>
      {/* One flat grid — cards pack left, fill row, then wrap */}
      <div className={styles.memberGrid}>
        {visible.map(member => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>

      {/* See More */}
      {hasHidden && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setExpanded(true)}
        >
          ↓ See {members.length - MOBILE_LIMIT} more members
        </button>
      )}

      {/* Show Less */}
      {canCollapse && (
        <button
          type="button"
          className={`${styles.showMoreBtn} ${styles.showLessBtn}`}
          onClick={() => setExpanded(false)}
        >
          ↑ Show less
        </button>
      )}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function OrganisersPage() {
  const [groups,  setGroups]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getMembersByEvent()
      .then(data => {
        const sorted = [...data].sort((a, b) => {
          const aMin = Math.min(...a.members.map(m => m.tagNo ?? 999))
          const bMin = Math.min(...b.members.map(m => m.tagNo ?? 999))
          return aMin - bMin
        })
        // Sort members within each event: by tagNo, then role priority, then date added
        sorted.forEach(g => {
          g.members.sort((a, b) => {
            if ((a.tagNo ?? 999) !== (b.tagNo ?? 999)) return (a.tagNo ?? 999) - (b.tagNo ?? 999)
            const rp = rolePriority(a.role) - rolePriority(b.role)
            if (rp !== 0) return rp
            return new Date(a.createdAt) - new Date(b.createdAt)
          })
        })
        setGroups(sorted)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar onRegister={() => {}} />
      <div className={styles.page}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>✦ Meet The Team</p>
            <h1 className={styles.heroTitle}>
              Event <span className={styles.gold}>Organisers</span>
            </h1>
            <p className={styles.heroSub}>
              The brilliant minds behind Sathak Thiruvizha 2026
            </p>
          </div>
        </div>

        <div className={styles.container}>
          {loading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>Loading organisers…</p>
            </div>
          )}
          {error && <div className={styles.errorBox}>⚠️ {error}</div>}
          {!loading && !error && groups.length === 0 && (
            <div className={styles.empty}>
              <p>✨ Organiser profiles coming soon. Check back!</p>
            </div>
          )}

          {/* One section per event — all members in one flat grid */}
          {!loading && groups.map((group, gi) => (
            <div key={group.eventSlug} className={styles.eventSection}>

              {/* Event title header */}
              <div className={styles.eventHeader}>
                <div className={styles.eventLine} />
                <div className={styles.eventTitleWrap}>
                  <span className={styles.eventIndex}>Event {gi + 1}</span>
                  <h2 className={styles.eventName}>{group.eventName}</h2>
                  <span className={styles.memberCount}>
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className={styles.eventLine} />
              </div>

              {/* All members in one flat grid — no tag sub-grouping */}
              <EventMemberGrid
                members={group.members}
                eventSlug={group.eventSlug}
              />

            </div>
          ))}
        </div>
      </div>
    </>
  )
}
