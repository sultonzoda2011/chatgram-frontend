import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/layout'
import { getToken } from './lib/utils/cookie'
import Login from './pages/auth/login/page'
import Register from './pages/auth/register/page'
import Chat from './pages/main/chat/page'
import Profile from './pages/main/profile/page'
import NotFound from './pages/not-found/page'
import Home from './pages/main/home/page'

const App = () => {
  const token = getToken()
  return (
    <BrowserRouter>
      <Routes>
        {token && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
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
