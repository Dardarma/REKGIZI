import { authApi } from '@/utils/baseURL'

export const getAsuhanUser = async (search = '', current_page = 1, limit = 10) => {
  const res = await authApi.get('/api/v1/asuhan/search', {
    params: {
      search,
      current_page,
      limit,
    },
  })
  return res.data
}

export const postAsuhan = async (data: any) => {
  const res = await authApi.post('/api/v1/rekam-pasien/',data)
  return res.data
}

export const getRekamPasien = async (id:number) => {
  const res = await authApi.get(`/api/v1/rekam-pasien/detail/${id}`)
  return res.data

}

export const getUserId = async(id:number) => {
  const res = await authApi.get(`/api/v1/asuhan/biodata/${id}`)
  return res.data
}

export const getInputParameter = async() => {
  const res = await authApi.get(`/api/v1/asuhan/getInput`)
  return res.data
}

export const getDiagnosa = async() => {
  const res = await authApi.get(`/api/v1/asuhan/getdiagnosa`)
  return res.data
}

export const getRekamPasienbyUser = async (id:number) => {
  const res = await authApi.get(`/api/v1/rekam-pasien/${id}`)
  return res.data
} 

export const postParameterPasien = async(data: any) => {
  const res = await authApi.post(`/api/v1/asuhan/create/rekam-pasien-parameter`,data)
  return res.data
}

export const getRekamPasienParameter = async (id:number) => {
  const res = await authApi.get(`/api/v1/asuhan/rekam-pasien-parameter/${id}`)
  return res.data
}

export const getDiagnosaPasien = async (id:number) => {
  const res = await authApi.get(`/api/v1/asuhan/diagnosa-pasien/${id}`)
  return res.data
}

export const postDiagnosaPasien = async (id:number, data:any) => {
  const res = await authApi.post(`/api/v1/asuhan/diagnosa-pasien/${id}`,data) 
  return res.data
}

