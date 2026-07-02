import { authApi } from '@/utils/baseURL'

export const getProfile = async () => {
  const res = await authApi.get('/api/v1/users/me')
  return res.data
}

export const updateProfile = async (data: any) => {
  const res = await authApi.patch('/api/v1/users/me', data)
  return res.data
}
