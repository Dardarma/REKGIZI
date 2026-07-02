import { authApi } from '@/utils/baseURL'

export const getUserAdmin = async (search = '', current_page = 1, limit = 10) => {
  try {
    const res = await authApi.get(`/api/v1/users/`, {
      params: {
        search,
        current_page,
        limit,
      },
    })
    return res.data
  } catch (error: any) {
    if (error.response?.Status_code === 404) {
      return []
    }
    throw error
  }
}

export const postUser = async (data:any) => {
  const res = await authApi.post(`/api/v1/users/`,data) 
  return res.data
}

export const editUser = async (id:number,data:any ) => {
  const res = await authApi.patch(`/api/v1/users/${id}`,data) 
  return res.data
}