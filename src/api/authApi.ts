import { api } from '../lib/utils/axiosConfig'
import type { IChangePassword, ILogin, IRegister, IUpdateProfile } from '../types/auth'

export const loginApi = async (data: ILogin) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: IRegister) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile')
  return response.data
}

export const updateProfile = async (data: IUpdateProfile) => {
  const response = await api.post('/auth/profile/update', data)
  return response.data
}
export const changePassword = async (data: IChangePassword) => {
  const response = await api.post('/auth/profile/change-password', data)
  return response.data
}
