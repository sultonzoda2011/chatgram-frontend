import { api } from '../lib/utils/axiosConfig'
import type { ILogin, IRegister } from '../types/auth'

export const loginApi = async (data: ILogin) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: IRegister) => {
  const response = await api.post('/auth/register', data)
  return response.data
}
