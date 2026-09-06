import { api } from '../lib/utils/axiosConfig'
import type {
  IAuthResponse,
  IChangePassword,
  ILogin,
  IProfileResponse,
  IRegister,
  IUpdateProfile,
} from '../types/auth'

export const loginApi = async (data: ILogin): Promise<IAuthResponse> => {
  const response = await api.post<IAuthResponse>('/auth/login', data)
  return response.data
}

export const registerApi = async (data: IRegister): Promise<IAuthResponse> => {
  const response = await api.post<IAuthResponse>('/auth/register', data)
  return response.data
}

export const getProfile = async (): Promise<IProfileResponse> => {
  const response = await api.get<IProfileResponse>('/auth/profile')
  return response.data
}

export const updateProfile = async (data: IUpdateProfile): Promise<IProfileResponse> => {
  const response = await api.patch<IProfileResponse>('/auth/profile', data)
  return response.data
}

export const changePassword = async (data: IChangePassword) => {
  const response = await api.patch('/auth/profile/change-password', data)
  return response.data
}

export const uploadProfileAvatar = async (image: File): Promise<IProfileResponse> => {
  const formData = new FormData()
  formData.append('image', image)
  const response = await api.post<IProfileResponse>('/auth/profile/avatar', formData)
  return response.data
}

export const removeProfileAvatar = async (): Promise<IProfileResponse> => {
  const response = await api.delete<IProfileResponse>('/auth/profile/avatar')
  return response.data
}
