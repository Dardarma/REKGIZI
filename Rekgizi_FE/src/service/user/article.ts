import { authApi } from "@/utils/baseURL";

export const getArticle = async(search = '', current_page = 1, limit = 10) =>{
  const res = await authApi.get('/api/v1/articles', {
    params: {
      search,
      current_page,
      limit,
    },
  })
  return res.data
}

export const getArticleById = async(id: number) =>{
  const res = await authApi.get(`/api/v1/articles/${id}`)
  return res.data
}