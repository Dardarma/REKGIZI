import { authApi } from "@/utils/baseURL";

export const getRekamMedis = async(search = '', current_page = 1, limit = 10) =>{
  const res = await authApi.get(`/api/v1/rekam-pasien/`,{
    params: {
      search,
      current_page,
      limit,
    },
  })
  return res.data
}
