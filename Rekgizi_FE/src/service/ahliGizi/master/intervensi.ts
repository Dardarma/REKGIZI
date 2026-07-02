import { authApi } from '@/utils/baseURL'

export const getIntervensi = async () => {
  try {
    const res = await authApi.get('/api/v1/intervensi/')
    return res.data
  } catch (error: any) {
    if (error.response?.Status_code === 404) {
      return []
    }
    throw error
  }
}

export const createIntervensi = async (data: any) => {
  const res = await authApi.post('/api/v1/intervensi/', data)
  return res.data
}

export const editIntervensi = async (id: number, data: any) => {
  const res = await authApi.patch(`/api/v1/intervensi/${id}`, data)
  return res.data
}

export const deleteIntervensi = async (id: number) => {
  const res = await authApi.patch(`/api/v1/intervensi/delete/${id}`)
  return res
}
