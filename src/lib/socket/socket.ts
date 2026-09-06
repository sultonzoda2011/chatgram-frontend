import { io, type Socket } from 'socket.io-client'
import { getToken } from '../utils/cookie'

let socket: Socket | null = null

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:5000'

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${WS_URL}/chat`, {
      autoConnect: false,
      auth: (cb) => cb({ token: getToken() }),
    })
  }
  return socket
}

export function connectSocket(): Socket {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
