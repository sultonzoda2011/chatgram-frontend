import { io, type Socket } from 'socket.io-client'
import { getToken } from './utils/cookie'

let socket: Socket | null = null

function getSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!apiUrl) return window.location.origin
  return apiUrl.replace(/\/api\/?$/, '')
}

export function connectChatSocket() {
  const token = getToken()
  if (!token) return null

  if (!socket) {
    socket = io(`${getSocketUrl()}/chat`, {
      autoConnect: false,
      auth: { token },
      transports: ['websocket'],
    })
  } else {
    socket.auth = { token }
  }

  if (!socket.connected) socket.connect()
  return socket
}

export function disconnectChatSocket() {
  socket?.disconnect()
  socket = null
}

export function getChatSocket() {
  return socket
}
