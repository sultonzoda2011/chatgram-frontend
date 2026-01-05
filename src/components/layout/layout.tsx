import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../lib/utils/cookie'
import Sidebar from './sidebar'

const Layout = () => {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" />
  }
  return (
    <div className='flex h-screen w-full overflow-hidden bg-background'>
      <Sidebar />
      <main className='flex-1 min-w-0 relative flex flex-col'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
