import { authApi } from '@/utils/baseURL'
import type { ArticlePayload } from '@/types/article'

export const getArticle = async (search = '', current_page = 1, limit = 10) => {
  const res = await authApi.get(`/api/v1/articles/admin`, {
    params: {
      search,
      current_page,
      limit,
    },
  })
  return res.data
}

export const getArticleById = async (id: number) => {
  const res = await authApi.get(`/api/v1/articles/${id}`)
  return res.data
}

export const createArticle = async (payload: ArticlePayload) => {
  const res = await authApi.post(`/api/v1/articles/`, payload)
  return res.data
}

export const updateArticle = async (id: number, payload: ArticlePayload) => {
  const res = await authApi.put(`/api/v1/articles/${id}`, payload)
  return res.data
}

export const deleteArticle = async (id: number) => {
  const res = await authApi.delete(`/api/v1/articles/${id}`)
  return res.data
}

const uploadFile = async (endpoint: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await authApi.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export const uploadThumbnail = (file: File) =>
  uploadFile('/api/v1/articles/upload/thumbnail', file)

export const uploadContentImage = (file: File) =>
  uploadFile('/api/v1/articles/upload/image', file)
