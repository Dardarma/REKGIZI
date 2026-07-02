import { ref } from 'vue'
import {
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadContentImage,
  uploadThumbnail,
} from '@/service/ahliGizi/article'
import type { Article, ArticlePayload, PaginatedResponse } from '@/types/article'
import Swal from 'sweetalert2'

export function useArticle() {
  const isLoading = ref(false)
  const isImageUploading = ref(false)
  const error = ref<string | null>(null)
  
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  
  // Pagination metadata
  const totalItems = ref(0)
  const currentPage = ref(1)
  const limitItems = ref(10)
  const totalPages = ref(1)

  const fetchArticles = async (search = '', page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const res: PaginatedResponse<Article> = await getArticle(search, page, limit)
      articles.value = res.data || []
      
      if (res.meta) {
        totalItems.value = res.meta.total ?? 0
        currentPage.value = res.meta.current_page ?? 1
        limitItems.value = res.meta.limit ?? 10
        totalPages.value = res.meta.total_pages ?? 1
      }
    } catch (err) {
      const errorObj = err as any
      error.value = errorObj?.response?.data?.detail || errorObj.message || 'Failed to fetch articles'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchArticle = async (id: number) => {
    isLoading.value = true
    error.value = null
    currentArticle.value = null
    try {
      const res = await getArticleById(id)
      // Assuming response structure is { data: Article } based on common patterns, 
      // otherwise adjust if backend returns direct object.
      currentArticle.value = res.data || res
      return currentArticle.value
    } catch (err) {
      const errorObj = err as any
      error.value = errorObj?.response?.data?.detail || errorObj.message || 'Failed to fetch article details'
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat artikel',
        text: error.value || '',
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const saveArticle = async (payload: ArticlePayload, id?: number) => {
    isLoading.value = true
    error.value = null
    try {
      if (id) {
        await updateArticle(id, payload)
      } else {
        await createArticle(payload)
      }
    } catch (err) {
      const errorObj = err as any
      error.value = errorObj?.response?.data?.detail || errorObj.message || 'Failed to save article'
      Swal.fire({
        icon: 'error',
        title: 'Gagal menyimpan artikel',
        text: error.value || '',
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeArticle = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await deleteArticle(id)
    } catch (err) {
      const errorObj = err as any
      error.value = errorObj?.response?.data?.detail || errorObj.message || 'Failed to delete article'
      Swal.fire({
        icon: 'error',
        title: 'Gagal menghapus artikel',
        text: error.value || '',
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const uploadArticleImage = async (file: File, type: 'thumbnail' | 'content') => {
    isImageUploading.value = true
    error.value = null
    try {
      const res = type === 'thumbnail'
        ? await uploadThumbnail(file)
        : await uploadContentImage(file)
      return res.url || res.data?.url // Return url based on how backend sends it
    } catch (err) {
      const errorObj = err as any
      error.value = errorObj?.response?.data?.detail || errorObj.message || 'Failed to upload image'
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengunggah gambar',
        text: error.value || '',
      })
      throw err
    } finally {
      isImageUploading.value = false
    }
  }

  const handleThumbnailUpload = (file: File) => uploadArticleImage(file, 'thumbnail')
  const handleContentImageUpload = (file: File) => uploadArticleImage(file, 'content')

  return {
    isLoading,
    isImageUploading,
    error,
    articles,
    currentArticle,
    totalItems,
    currentPage,
    limitItems,
    totalPages,
    fetchArticles,
    fetchArticle,
    saveArticle,
    removeArticle,
    handleThumbnailUpload,
    handleContentImageUpload,
  }
}
