import { api } from '../lib/utils/axiosConfig'
import type { Login, Register } from '../types/auth'

export const loginApi = async (data: Login) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: Register) => {
  const response = await api.post('/auth/register', data)
  return response.data
}
