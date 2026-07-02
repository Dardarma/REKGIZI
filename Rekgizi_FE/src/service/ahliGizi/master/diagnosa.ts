import { authApi } from '@/utils/baseURL'

export const getDiagnosa = async () => {
  try {
    const res = await authApi.get('/api/v1/diagnosa/')
    return res.data
  } catch (error: any) {
    if (error.response?.Status_code === 404) {
      return []
    }
    throw error
  }
}

export const createDiagnosa = async (data: any) => {
  const res = await authApi.post('/api/v1/diagnosa/',data)
  return res.data
}

export const editDiagnosa = async (id: number, data: any) => {
  const res = await authApi.patch(`/api/v1/diagnosa/${id}`,data)
  return res.data
}

export const deleteDiagnosa = async (id:number) => {
  const res = await authApi.patch(`/api/v1/diagnosa/delete/${id}`)
  return res.data
}
