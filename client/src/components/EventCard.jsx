import styles from './EventCard.module.css'
import { CATEGORY_COLORS } from '../lib/config'

export default function EventCard({ event, delay = 0 }) {
  const color = CATEGORY_COLORS[event.category] || event.accent || '#FFD700'

  const handleRegister = () => {
    // If hackathon link is present (regardless of isHackathon flag), use it
    if (event.hackathonLink) {
      window.open(event.hackathonLink, '_blank', 'noreferrer')
      return
    }
    // Standard Google Form link
    if (event.googleFormLink) {
      window.open(event.googleFormLink, '_blank', 'noreferrer')
      return
    }
    // Fallback
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className={`${styles.card} reveal`}
      style={{ '--accent': color, transitionDelay: `${delay}s` }}
      data-hover
    >
      <div className={styles.topBar} />

      <div className={styles.header}>
        <span className={styles.icon}>{event.icon}</span>
        <div>
          <span className={styles.category} style={{ color }}>
            {event.category?.toUpperCase()}
          </span>
          <div className={styles.day}>{event.day?.replace('day', 'Day ')}</div>
        </div>
        {event.isHackathon && (
          <span className={styles.hackBadge}>25hrs</span>
        )}
      </div>

      <h3 className={styles.name}>{event.name}</h3>
      <p className={styles.tagline}>{event.tagline}</p>
      <p className={styles.desc}>{event.description}</p>

      <div className={styles.meta}>
        {event.teamSize && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>👥</span>
            <span>{event.teamSize}</span>
          </div>
        )}
        {(event.time || event.duration) && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>⏱</span>
            <span>{event.time || event.duration}</span>
          </div>
        )}
        {event.seatCapacity > 0 && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🪑</span>
            <span>{event.seatCapacity} seats</span>
          </div>
        )}
        {event.venue && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📍</span>
            <span>{event.venue}</span>
          </div>
        )}
      </div>

      {event.cashPrize && (
        <div className={styles.metaItem} style={{ marginTop: '8px' }}>
          <span className={styles.metaIcon}>🏆</span>
          <span style={{ color: '#FFD700', fontWeight: 600 }}>Prize: {event.cashPrize}</span>
        </div>
      )}

      {event.perks?.length > 0 && (
        <div className={styles.perks}>
          {event.perks.map(p => (
            <span key={p} className={styles.perk} style={{ borderColor: color + '40', color }}>
              {p}
            </span>
          ))}
        </div>
      )}

      {event.features?.length > 0 && (
        <div className={styles.perks}>
          {event.features.map(f => (
            <span key={f} className={styles.perk} style={{ borderColor: '#ffffff20', color: 'rgba(255,255,255,0.6)' }}>
              {f}
            </span>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.price}>
          {!event.entryFee || event.entryFee === 0 ? (
            <span className={styles.free}>FREE</span>
          ) : (
            <>
              <span className={styles.priceCurr}>₹</span>
              <span className={styles.priceAmt}>{event.entryFee}</span>
              <span className={styles.pricePer}>
                /{(event.feeType || 'per_team') === 'per_head' ? 'head' : 'team'}
              </span>
            </>
          )}
        </div>
        <button
          className={styles.regBtn}
          onClick={handleRegister}
          style={{ '--btn-color': color }}
          data-hover
        >
          {event.isHackathon ? '🚀 Register →' : 'Register →'}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
