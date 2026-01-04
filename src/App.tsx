import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/layout'
import { getToken } from './lib/utils/cookie'
import Login from './pages/auth/login/page'
import Register from './pages/auth/register/page'

const App = () => {
  const token = getToken()
  return (
    <BrowserRouter>
      <Routes>
        {token && (
          <Route path="/" element={<Layout />}>
          </Route>
        )}
        {!token && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
