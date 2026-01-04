import { api } from '../lib/utils/axiosConfig'
import type { Login, Register } from '../types/auth'

export const loginApi = async (data: Login) => {
  try {
    const response = await api.post('/auth/login', data)
    return response.data
  } catch (error) {
    throw error
  }
}
export const registerApi = async (data: Register) => {
  try {
    const response = await api.post('/auth/register', data)
    return response.data
  } catch (error) {
    throw error
  }
}
