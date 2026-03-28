import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../lib/api'

export default function RequireAuth({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn()) navigate('/admin')
  }, [navigate])
  return isLoggedIn() ? children : null
}
