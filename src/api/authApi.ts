import { api } from '../lib/utils/axiosConfig'
import type { IApiResponse } from '../types/chat'
import type { IChangePassword, ILogin, IProfile, IRegister, IUpdateProfile } from '../types/auth'

export const loginApi = async (data: ILogin): Promise<IApiResponse<{ token: string }>> => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: IRegister): Promise<IApiResponse<{ token: string }>> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getProfile = async (): Promise<IApiResponse<IProfile>> => {
  const response = await api.get('/auth/profile')
  return response.data
}

export const updateProfile = async (
  data: IUpdateProfile,
): Promise<IApiResponse<IProfile>> => {
  const response = await api.patch('/auth/profile', data)
  return response.data
}

export const changePassword = async (data: IChangePassword): Promise<IApiResponse<null>> => {
  const response = await api.patch('/auth/profile/change-password', data)
  return response.data
}
