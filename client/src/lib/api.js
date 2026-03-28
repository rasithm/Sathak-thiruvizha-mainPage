const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() { return localStorage.getItem('habibi_admin_token') }
function authHeaders() { return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } }
async function handle(res) { const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Request failed'); return data }

// ── AUTH
export async function adminLogin(username, password) {
  const res = await fetch(`${BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username, password }) })
  const data = await handle(res)
  localStorage.setItem('habibi_admin_token', data.token)
  return data
}
export function adminLogout() { localStorage.removeItem('habibi_admin_token') }
export function isLoggedIn()  { return !!getToken() }

// ── PUBLIC EVENTS
export async function getEvents({ day, category } = {}) {
  const p = new URLSearchParams()
  if (day && day !== 'all') p.set('day', day)
  if (category && category !== 'all') p.set('category', category)
  return handle(await fetch(`${BASE}/events?${p}`))
}
export async function getEventBySlug(slug) { return handle(await fetch(`${BASE}/events/${slug}`)) }

// ── ADMIN EVENTS
export async function adminGetEvents({ day, category, active } = {}) {
  const p = new URLSearchParams()
  if (day && day !== 'all') p.set('day', day)
  if (category && category !== 'all') p.set('category', category)
  if (active !== undefined) p.set('active', active)
  return handle(await fetch(`${BASE}/events/admin/all?${p}`, { headers: authHeaders() }))
}
export async function adminCreateEvent(data) { return handle(await fetch(`${BASE}/events`, { method:'POST', headers:authHeaders(), body:JSON.stringify(data) })) }
export async function adminUpdateEvent(id, data) { return handle(await fetch(`${BASE}/events/${id}`, { method:'PUT', headers:authHeaders(), body:JSON.stringify(data) })) }
export async function adminDeleteEvent(id) { return handle(await fetch(`${BASE}/events/${id}`, { method:'DELETE', headers:authHeaders() })) }
export async function adminSeedEvents(events) { return handle(await fetch(`${BASE}/events/seed/init`, { method:'POST', headers:authHeaders(), body:JSON.stringify({ events }) })) }

// ── DEPT POINTS
export async function getDeptPoints() { return handle(await fetch(`${BASE}/deptpoints`)) }
export async function adminGetDeptKnown() { return handle(await fetch(`${BASE}/deptpoints/known`, { headers: authHeaders() })) }
export async function adminGetDeptHistory() { return handle(await fetch(`${BASE}/deptpoints/history`, { headers: authHeaders() })) }
export async function adminAddDeptPoint(data) { return handle(await fetch(`${BASE}/deptpoints`, { method:'POST', headers:authHeaders(), body:JSON.stringify(data) })) }
export async function adminDeleteDeptPoint(id) { return handle(await fetch(`${BASE}/deptpoints/${id}`, { method:'DELETE', headers:authHeaders() })) }
export function adminExportDeptExcel() {
  fetch(`${BASE}/deptpoints/export`, { headers: authHeaders() })
    .then(r => r.blob())
    .then(blob => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='dept_points.xlsx'; a.click(); URL.revokeObjectURL(url) })
}

// ── MEMBERS
export async function getMembers(eventSlug) {
  const p = new URLSearchParams()
  if (eventSlug) p.set('eventSlug', eventSlug)
  return handle(await fetch(`${BASE}/members?${p}`))
}
export async function getMembersByEvent() { return handle(await fetch(`${BASE}/members/by-event`)) }
export async function adminGetNextTag(eventSlug) { return handle(await fetch(`${BASE}/members/next-tag/${encodeURIComponent(eventSlug)}`, { headers: authHeaders() })) }
export async function adminCreateMember(data) { return handle(await fetch(`${BASE}/members`, { method:'POST', headers:authHeaders(), body:JSON.stringify(data) })) }
export async function adminUpdateMember(id, data) { return handle(await fetch(`${BASE}/members/${id}`, { method:'PUT', headers:authHeaders(), body:JSON.stringify(data) })) }
export async function adminDeleteMember(id) { return handle(await fetch(`${BASE}/members/${id}`, { method:'DELETE', headers:authHeaders() })) }
