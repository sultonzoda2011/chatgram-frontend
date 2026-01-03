import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../lib/utils/cookie'
const Layout = () => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" />
  }
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Layout
