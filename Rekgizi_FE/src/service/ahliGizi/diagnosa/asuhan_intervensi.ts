import { authApi } from "@/utils/baseURL";

export const getIntervensi = async () => {
  try {
    const res = await authApi.get(`/api/v1/asuhan-intervensi/`)
    return res.data
  } catch (error: any) {
    if (error.response?.Status_code === 404) {
      return []
    }
    throw error
  }
}

export const saveIntervensi = async (id:number, payload: any) => {
    const res = await authApi.patch(`/api/v1/asuhan-intervensi/save_intervensi/${id}`, payload)
    return res.data
}

export const getSummary = async(id:number) => {
  const res = await authApi.get(`/api/v1/asuhan-intervensi/get_summary/${id}`)
  return res.data
}

export const prediksiIntervensi = async(id:number) => {
  const res = await authApi.get(`/api/v1/asuhan-intervensi/predict/${id}`)
  return res.data
}

export const setujuiIntervensi = async(id:number, payload: any) => {
  const res = await authApi.patch(`/api/v1/asuhan-intervensi/validasi/${id}`, payload)
  return res.data
}
