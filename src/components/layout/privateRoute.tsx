import { Navigate } from 'react-router-dom'
import { getToken } from '../../lib/utils/cookie'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getToken()
    if (!token) return <Navigate to="/login" replace />
    return children
}

export default PrivateRoute
