import { useState, useEffect, Fragment } from 'react'
import { CONFIG } from '../lib/config'
import styles from './Countdown.module.css'

export default function Countdown() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })

  useEffect(() => {
    const tick = () => {
      const diff = CONFIG.FESTIVAL_START - Date.now()
      if (diff <= 0) {
        setTime({ d: '00', h: '00', m: '00', s: '00' })
        return
      }
      setTime({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { val: time.d, label: 'Days' },
    { val: time.h, label: 'Hours' },
    { val: time.m, label: 'Minutes' },
    { val: time.s, label: 'Seconds' },
  ]

  return (
    <div className={styles.wrap}>
      {units.map((u, i) => (
        <Fragment key={u.label}>
          <div className={styles.unit}>
            <div className={styles.card}>
              <span className={styles.val}>{u.val}</span>
            </div>
            <span className={styles.label}>{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className={styles.sep}>:</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}