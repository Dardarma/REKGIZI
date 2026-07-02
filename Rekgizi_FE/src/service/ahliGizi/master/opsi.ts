import { authApi } from '@/utils/baseURL'

export const getOpsi = async (parameter_id: number) => {
  try {
    const res = await authApi.get(`/api/v1/opsi-parameter/${parameter_id}`)
    return res.data
  } catch (error:any) {
    if (error.response?.Status_code === 404) {
      return []
    }
    throw error
  }
}

export const createOpsi = async (data:any) => {
    const res = await authApi.post('/api/v1/opsi-parameter/',data)
    return res.data
}

export const editOpsi = async (opsi_id:number, data:any) => {
    const res = await authApi.patch(`/api/v1/opsi-parameter/${opsi_id}`,data)
    return res.data
}

export const deleteOpsi = async (opsi_id:number) => {
    const res = await authApi.patch(`/api/v1/opsi-parameter/delete/${opsi_id}`)
    return res.data
}