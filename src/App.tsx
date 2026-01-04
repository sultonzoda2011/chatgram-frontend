import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/layout'
import Home from './pages/main/home/page'
import { getToken } from './lib/utils/cookie'
import Login from './pages/auth/login/page'
import Register from './pages/auth/register/page'
import Chat from './pages/main/chat/page'

const App = () => {
  const token = getToken()
  return (
    <BrowserRouter>
      <Routes>
        {token && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
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
