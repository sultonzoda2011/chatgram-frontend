import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../lib/utils/cookie'
import Sidebar from './sidebar'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'

const Layout = () => {
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className='flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300'>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{ left: '-10%', top: '10%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]"
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ right: '-5%', bottom: '15%' }}
        />
      </div>

      <Sidebar />

      <main className='flex-1 min-w-0 relative flex flex-col z-10'>
        <Outlet />
      </main>

      <Toaster position="top-center" expand={false} richColors />
    </div>
  )
}

export default Layout
