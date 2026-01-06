import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login/page'
import Register from './pages/auth/register/page'
import Chat from './pages/main/chat/page'
import Profile from './pages/main/profile/page'
import NotFound from './pages/not-found/page'
import Home from './pages/main/home/page'
import Layout from './components/layout/layout'
import PrivateRoute from './components/layout/privateRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
