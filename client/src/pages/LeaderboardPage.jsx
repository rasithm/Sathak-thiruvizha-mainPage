import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getDeptPoints } from '../lib/api'
import styles from './LeaderboardPage.module.css'

const MEDAL = ['🥇', '🥈', '🥉']
const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

const FILTER_MODES = [
  { id: 'overall',    label: '🏆 Overall Dept'   },
  { id: 'year',       label: '📅 By Year'         },
  { id: 'separate',   label: '📊 Separate'        },
  { id: 'department', label: '🏢 Department'      },
]

export default function LeaderboardPage() {
  const [rawPoints, setRawPoints] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [mode,      setMode]      = useState('overall')
  const [selDept,   setSelDept]   = useState('')
  const [selYear,   setSelYear]   = useState('')

  useEffect(() => {
    getDeptPoints()
      .then(data => setRawPoints(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const allDepts = useMemo(() => [...new Set(rawPoints.map(d => d.deptName))].sort(), [rawPoints])
  const allYears = useMemo(() => [...new Set(rawPoints.map(d => d.year))].sort(), [rawPoints])

  const rows = useMemo(() => {
    if (!rawPoints.length) return []
    if (mode === 'overall') {
      const map = {}
      rawPoints.forEach(d => { map[d.deptName] = (map[d.deptName] || 0) + d.points })
      return Object.entries(map).map(([dept, total]) => ({ dept, total })).sort((a,b) => b.total - a.total)
    }
    if (mode === 'year') {
      return rawPoints.filter(d => (!selDept || d.deptName === selDept) && (!selYear || d.year === selYear))
                      .sort((a,b) => b.points - a.points)
    }
    if (mode === 'separate') {
      return [...rawPoints].sort((a,b) => b.points - a.points)
    }
    if (mode === 'department') {
      const deptMap = {}
      rawPoints.forEach(d => {
        if (!deptMap[d.deptName]) deptMap[d.deptName] = { total: 0, years: [] }
        deptMap[d.deptName].total += d.points
        deptMap[d.deptName].years.push(d)
      })
      Object.values(deptMap).forEach(v => v.years.sort((a,b) => b.points - a.points))
      return Object.entries(deptMap).sort((a,b) => b[1].total - a[1].total)
                   .map(([dept, info]) => ({ dept, total: info.total, years: info.years }))
    }
    return []
  }, [rawPoints, mode, selDept, selYear])

  const top3 = mode === 'overall' && rows.length >= 3 ? rows : null

  return (
    <>
      <Navbar onRegister={() => {}} />
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>✦ Live Rankings</p>
            <h1 className={styles.title}>Department<br /><span className={styles.gold}>Leaderboard</span></h1>
            <p className={styles.sub}>Points updated live by admin · Habibi Fest 2026</p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.filterTabs}>
            {FILTER_MODES.map(f => (
              <button type="button" key={f.id}
                className={`${styles.filterTab} ${mode === f.id ? styles.filterTabActive : ''}`}
                onClick={() => setMode(f.id)}>{f.label}</button>
            ))}
          </div>

          {mode === 'year' && (
            <div className={styles.subFilters}>
              <select className={styles.filterSelect} value={selDept} onChange={e => setSelDept(e.target.value)}>
                <option value="">All Departments</option>
                {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className={styles.filterSelect} value={selYear} onChange={e => setSelYear(e.target.value)}>
                <option value="">All Years</option>
                {allYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          {loading && <div className={styles.loading}><div className={styles.spinner}/><p>Loading rankings...</p></div>}
          {error   && <div className={styles.errorBox}>⚠️ {error}</div>}
          {!loading && !error && rawPoints.length === 0 && <div className={styles.empty}><p>🏆 No department points yet.</p></div>}

          {!loading && rows.length > 0 && (
            <>
              {top3 && rows.length >= 3 && (
                <div className={styles.podium}>
                  {[rows[1], rows[0], rows[2]].map((d, idx) => {
                    const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3
                    return (
                      <div key={d.dept} className={`${styles.podiumItem} ${idx===1?styles.podiumFirst:''}`}
                        style={{'--rank-color': RANK_COLORS[rank-1]}}>
                        <div className={styles.podiumMedal}>{MEDAL[rank-1]}</div>
                        <div className={styles.podiumDept}>{d.dept}</div>
                        <div className={styles.podiumScore}>{d.total} <span>pts</span></div>
                        <div className={styles.podiumBase} style={{height: idx===1?100:idx===0?70:50}}><span>#{rank}</span></div>
                      </div>
                    )
                  })}
                </div>
              )}

              {mode === 'overall' && (
                <div className={styles.table}>
                  <div className={`${styles.tableHeader} ${styles.h3col}`}>
                    <span>Rank</span><span>Department</span><span>Total Points</span>
                  </div>
                  {rows.map((d,i) => (
                    <div key={d.dept} className={`${styles.tableRow} ${styles.r3col} ${i<3?styles.topRow:''}`} style={i<3?{'--rank-color':RANK_COLORS[i]}:{}}>
                      <span className={styles.rankCell}>{i<3?MEDAL[i]:<span className={styles.rankNum}>#{i+1}</span>}</span>
                      <span className={styles.deptCell}>{d.dept}</span>
                      <span className={`${styles.ptCell} ${d.total<0?styles.negative:styles.positive}`}>{d.total>=0?'+':''}{d.total} pts</span>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'year' && (
                <div className={styles.table}>
                  <div className={`${styles.tableHeader} ${styles.h5col}`}>
                    <span>Rank</span><span>Department</span><span>Year</span><span>Points</span><span>Reason</span>
                  </div>
                  {rows.map((d,i) => (
                    <div key={`${d.deptName}-${d.year}-${i}`} className={`${styles.tableRow} ${styles.r5col} ${i<3?styles.topRow:''}`} style={i<3?{'--rank-color':RANK_COLORS[i]}:{}}>
                      <span className={styles.rankCell}>{i<3?MEDAL[i]:<span className={styles.rankNum}>#{i+1}</span>}</span>
                      <span className={styles.deptCell}>{d.deptName}</span>
                      <span className={styles.yearCell}>{d.year}</span>
                      <span className={`${styles.ptCell} ${d.points<0?styles.negative:styles.positive}`}>{d.points>=0?'+':''}{d.points} pts</span>
                      <span className={styles.reasonCell}>{d.reason||'—'}</span>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'separate' && (
                <div className={styles.table}>
                  <div className={`${styles.tableHeader} ${styles.h4col}`}>
                    <span>Rank</span><span>Department</span><span>Year</span><span>Points</span>
                  </div>
                  {rows.map((d,i) => (
                    <div key={`${d.deptName}-${d.year}-${i}`} className={`${styles.tableRow} ${styles.r4col} ${i<3?styles.topRow:''}`} style={i<3?{'--rank-color':RANK_COLORS[i]}:{}}>
                      <span className={styles.rankCell}>{i<3?MEDAL[i]:<span className={styles.rankNum}>#{i+1}</span>}</span>
                      <span className={styles.deptCell}>{d.deptName}</span>
                      <span className={styles.yearCell}>{d.year}</span>
                      <span className={`${styles.ptCell} ${d.points<0?styles.negative:styles.positive}`}>{d.points>=0?'+':''}{d.points} pts</span>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'department' && (
                <div className={styles.deptGroups}>
                  {rows.map((g, gi) => (
                    <div key={g.dept} className={styles.deptGroup}>
                      <div className={styles.deptGroupHeader}>
                        <span className={styles.deptGroupRank}>{gi<3?MEDAL[gi]:<span className={styles.rankNum}>#{gi+1}</span>}</span>
                        <span className={styles.deptGroupName}>{g.dept}</span>
                        <span className={`${styles.deptGroupTotal} ${g.total<0?styles.negative:styles.positive}`}>{g.total>=0?'+':''}{g.total} pts total</span>
                      </div>
                      <div className={styles.yearRows}>
                        {g.years.map((y,yi) => (
                          <div key={`${y.year}-${yi}`} className={styles.yearRow}>
                            <span className={styles.yearRowYear}>{y.year}</span>
                            <span className={styles.yearRowReason}>{y.reason||'—'}</span>
                            <span className={`${styles.yearRowPts} ${y.points<0?styles.negative:styles.positive}`}>{y.points>=0?'+':''}{y.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className={styles.footer}>
            <Link to="/" className={styles.backLink}>← Back to Home</Link>
            <p className={styles.note}>Points are updated by administrators and reflect the latest standings.</p>
          </div>
        </div>
      </div>
    </>
  )
}
