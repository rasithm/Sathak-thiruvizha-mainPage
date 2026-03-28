import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage     from './pages/LandingPage'
import HomePage        from './pages/HomePage'
import AdminLoginPage  from './pages/AdminLoginPage'
import AdminDashboard  from './pages/AdminDashboard'
import AdminEventEdit  from './pages/AdminEventEdit'
import AdminMemberEdit from './pages/AdminMemberEdit'
// import DevelopersPage  from './pages/DevelopersPage'
import LeaderboardPage from './pages/LeaderboardPage'
import OrganisersPage  from './pages/OrganisersPage'
import Cursor          from './components/Cursor'
import Environment     from './components/Environment'
import RequireAuth     from './components/RequireAuth'

// Paths that use the shared Cursor + Environment overlay
const MAIN_APP_PATHS = ['/home', '/developers', '/leaderboard', '/organisers']

export default function App() {
  const { pathname } = useLocation()
  const isMainApp = MAIN_APP_PATHS.includes(pathname)
  const isAdmin   = pathname.startsWith('/admin')

  useEffect(() => {
    document.body.setAttribute('data-admin', isAdmin ? 'true' : 'false')
    return () => document.body.removeAttribute('data-admin')
  }, [isAdmin])

  // Always scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      {isMainApp && <Cursor />}
      {isMainApp && <Environment />}
      <Routes>
        {/* Landing page — the festival HTML showcase, shown first */}
        <Route path="/"            element={<LandingPage />} />

        {/* Main app — moved from / to /home */}
        <Route path="/home"        element={<HomePage />} />

        {/* <Route path="/developers"        element={<DevelopersPage />} /> */}
        <Route path="/leaderboard"       element={<LeaderboardPage />} />
        <Route path="/organisers"        element={<OrganisersPage />} />
        <Route path="/admin"             element={<AdminLoginPage />} />
        <Route path="/admin/dashboard"   element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/events/:id"  element={<RequireAuth><AdminEventEdit /></RequireAuth>} />
        <Route path="/admin/members/new" element={<RequireAuth><AdminMemberEdit /></RequireAuth>} />
        <Route path="/admin/members/:id" element={<RequireAuth><AdminMemberEdit /></RequireAuth>} />
      </Routes>
    </>
  )
}
