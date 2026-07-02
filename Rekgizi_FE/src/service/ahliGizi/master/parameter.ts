import { authApi } from '@/utils/baseURL'

export const getParameter = async () => {
  try {
    const res = await authApi.get('/api/v1/parameter/')
    return res.data
  } catch (error:any) {
    if (error.response?.Status_code === 404){
      return []
    }
    throw error
  }
}

export const getParameterID = async (id:number) => {
  const res = await authApi.get(`/api/v1/parameter/${id}`)
  return res
}

export const createParameter = async (data: any) => {
  const res = await authApi.post('/api/v1/parameter/', data)
  return res
}

export const editParameter = async (id: number, data: any) => {
  const res = await authApi.patch(`/api/v1/parameter/${id}`, data)
  return res
}

export const deleteParameter = async (id:number) => {
  const res = await authApi.patch(`/api/v1/parameter/delete/${id}`)
  return res
}
