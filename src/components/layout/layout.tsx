import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../lib/utils/cookie'
import Sidebar from './sidebar/sidebar'

const Layout = () => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" />
  }
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
