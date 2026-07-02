export interface Article {
  id: number
  user_id: number
  nama_pembuat: string
  judul: string
  konten: string
  thumbnail_url?: string | null
  is_published: boolean
  tanggal: string
}

export interface ArticlePayload {
  user_id?: number
  judul: string
  thumbnail_url?: string | null
  konten?: string
  is_published?: boolean
}

export interface PaginatedResponse<T> {
  meta: {
    total: number
    current_page: number
    limit: number
    total_pages: number
  }
  data: T[]
}
